import { AlertTriangle, Eye, PackageOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

interface AlertsAndActionsProps {
  onShowDetails: (title: string) => void;
  onShowReviewList: (
    id: string,
    hsCode: string,
    confidence: number,
    createdAt: string,
    product: string,
    description: string
  ) => void;
  onViewShipmentDetails: (shipmentId: string) => void;
  dbBump: number;
  onDataSaved: () => void;
}

export interface ReviewAlert {
  db_id: number;
  createdAt: string;       // or created_at from your API — normalize in the API if needed
  type: number;            // 1 = classification, 2 = shipment action
  id: string;              // classification.id (type 1) or shipmentId (type 2)
  user?: string;
  updated_reason?: string;
}

type Classification = {
  id: string;
  hs_code: string;
  confidence: number | string;
  product_title: string;
  product_description: string;
  createdAt?: string;
  created_at?: string;
};

function formatWhen(input?: string) {
  if (!input) return '';
  const d = new Date(input);
  return isNaN(d.getTime()) ? input : d.toLocaleString();
}

/** Single row renderer */
function AlertRow({
  alert,
  onShowReviewList,
  onViewShipmentDetails,
  dbBump
  
}: {
  alert: ReviewAlert;
  onShowReviewList: AlertsAndActionsProps['onShowReviewList'];
  onViewShipmentDetails: AlertsAndActionsProps['onViewShipmentDetails'];
  dbBump: number;
}) {
  const [classification, setClassification] = useState<Classification | null>(null);
  const [loading, setLoading] = useState(alert.type === 1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (alert.type !== 1) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/get/classification?id=${encodeURIComponent(alert.id)}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as Classification;
        if (!cancelled) setClassification(data ?? null);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load classification');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [alert, dbBump]);

  // TYPE 1 — Review a classification
  if (alert.type === 1) {
    return (
      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <div>
            <h4 className="text-sm font-medium text-slate-900">Review Required</h4>

            {loading && <p className="text-xs text-slate-600">Loading classification…</p>}

            {!loading && error && (
              <p className="text-xs text-red-600">
                Failed to load classification for id {alert.id}: {error}
              </p>
            )}

            {!loading && !error && classification && (
              <>
                <p className="text-xs text-slate-600">
                  {classification.product_title} classification needs review
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                    {typeof classification.confidence === 'string'
                      ? classification.confidence
                      : `${classification.confidence}`}% confidence
                  </Badge>
                  <span className="text-xs text-slate-500">Below 100% threshold</span>
                </div>
              </>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={loading || !!error || !classification}
          onClick={() => {
            if (!classification) return;
            const when = classification.createdAt || classification.created_at || '';
            const pct = Number(classification.confidence);
            onShowReviewList(
              classification.id,
              classification.hs_code,
              isNaN(pct) ? 0 : Math.round(pct),
              when,
              classification.product_title,
              classification.product_description
            );
          }}
          className="flex items-center space-x-1"
          title="Open in Review List"
        >
          <Eye className="w-4 h-4" />
          <span className="text-xs">Review</span>
        </Button>
      </div>
    );
  }

  // TYPE 2 — Shipment action
  if (alert.type === 2) {
    return (
      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <PackageOpen className="w-5 h-5 text-slate-600" />
          <div>
            <h4 className="text-sm font-medium text-slate-900">Shipment Action</h4>
            <p className="text-xs text-slate-600">id: {alert.id}</p>
            {alert.updated_reason && (
              <p className="text-xs text-slate-600">reason: {alert.updated_reason}</p>
            )}
            <p className="text-xs text-slate-500">at: {formatWhen(alert.createdAt)}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewShipmentDetails(alert.id)}
          className="flex items-center space-x-1"
          title="Open Shipment"
        >
          <Eye className="w-4 h-4" />
          <span className="text-xs">Open</span>
        </Button>
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 text-slate-600" />
        <div>
          <h4 className="text-sm font-medium text-slate-900">Unknown action</h4>
          <p className="text-xs text-slate-600">type: {alert.type}</p>
          <p className="text-xs text-slate-600">id: {alert.id}</p>
          <p className="text-xs text-slate-500">at: {formatWhen(alert.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}

const AlertsAndActions = ({
  onShowDetails,
  onShowReviewList,
  onViewShipmentDetails,
  dbBump,
  onDataSaved
}: AlertsAndActionsProps) => {
  const [alerts, setAlerts] = useState<ReviewAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/get/alerts');
        const json = (await res.json()) as ReviewAlert[];
        setAlerts(json);
      } catch (err) {
        console.error('Failed to fetch alerts', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [dbBump]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <span>Alerts and Actions Required</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {!loading && alerts.length === 0 && (
          <p className="text-sm text-slate-500">No items need review 🎉</p>
        )}

        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertRow
              key={alert.db_id}
              alert={alert}
              onShowReviewList={onShowReviewList}
              onViewShipmentDetails={onViewShipmentDetails}
              dbBump={dbBump}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsAndActions;
