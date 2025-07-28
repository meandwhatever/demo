
import { AlertTriangle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

interface AlertsAndActionsProps {
  onShowDetails: (title: string) => void;
  onShowReviewList: (id: string, hsCode: string, confidence: number, createdAt: string, product: string, description: string) => void;
}
export interface ReviewAlert {
  id: string;
  hs_code: string;
  product_title: string;
  product_description: string;
  confidence: number;
  createdAt: string;
}

const AlertsAndActions = ({ onShowDetails, onShowReviewList }: AlertsAndActionsProps) => {
  const [alerts, setAlerts]   = useState<ReviewAlert[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    (async () => {
      try {
        const res   = await fetch('/api/get/alerts');
        const json  = (await res.json()) as ReviewAlert[];
        console.log("alerts", json)
        setAlerts(json);
      } catch (err) {
        console.error('Failed to fetch alerts', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <span>Alerts and Actions Required</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* loading state */}
        {loading && <p className="text-sm text-slate-500">Loading…</p>}

        {/* empty‑state once loaded */}
        {!loading && alerts.length === 0 && (
          <p className="text-sm text-slate-500">No items need review 🎉</p>
        )}

        {/* list */}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="text-sm font-medium text-slate-900">
                    Review Required
                  </h4>
                  <p className="text-xs text-slate-600">
                    {alert.product_title} classification needs review
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      variant="outline"
                      className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300"
                    >
                      {alert.confidence}% confidence
                    </Badge>
                    <span className="text-xs text-slate-500">
                      Below 100 % threshold
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onShowReviewList(alert.id, alert.hs_code, alert.confidence, alert.createdAt, alert.product_title, alert.product_description)}
                className="flex items-center space-x-1"
                title="Open in Review List"
              >
                <Eye className="w-4 h-4" />
                <span className="text-xs">Review</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


export default AlertsAndActions;
