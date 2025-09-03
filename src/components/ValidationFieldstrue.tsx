import { useMemo, useState } from 'react';
import { CheckCircle, AlertCircle, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shipment } from '@/components/ShipmentDetails';

type FieldStatus = 'match' | 'mismatch';

interface ValidationField {
  label: string;
  path: string; // dot path, e.g. "shipment.total_weight"
  mblValue: string | number | null;
  hblValue: string | number | null;
  status: FieldStatus; // based ONLY on the originals
}

const fieldsToValidate: Array<{ label: string; path: string }> = [
  { label: 'total weight', path: 'shipment.total_weight' },
  { label: 'total volume', path: 'shipment.total_volume' },
  { label: 'total package', path: 'shipment.total_package' }
];

function getAt(obj: any, path: string): any {
  if (!obj) return null;
  return path.split('.').reduce((acc, key) => (acc == null ? null : acc[key]), obj);
}

function normalize(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return val.trim();
  return String(val);
}

function setNested(obj: any, path: string, value: any) {
  const keys = path.split('.');
  const base = obj && typeof obj === 'object' ? (Array.isArray(obj) ? [...obj] : { ...obj }) : {};
  let curr: any = base;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const child = curr[k];
    const next =
      child && typeof child === 'object'
        ? Array.isArray(child)
          ? [...child]
          : { ...child }
        : {};
    curr[k] = next;
    curr = next;
  }
  curr[keys[keys.length - 1]] = value;
  return base;
}

type ChoiceSide = 'mbl' | 'hbl';

const ValidationFields = ({ shipmentData, onBuilt }: { shipmentData: Shipment; onBuilt: () => void }) => {
  const missingMBL = shipmentData.mblRawJson == null;
  const missingHBL = shipmentData.hblRawJson == null;

  if (missingMBL || missingHBL) {
    return (
      <div className="p-4 space-y-2">
        {missingMBL && <div className="text-sm font-medium text-red-600">missing mbl</div>}
        {missingHBL && <div className="text-sm font-medium text-red-600">missing hbl</div>}
      </div>
    );
  }
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);


  async function handleConfirm() {
    try {
      setSaving(true);
      setSaveMsg(null);
      const res = await fetch('/api/create/build_shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipmentId: shipmentData.shipmentId,
          mbl_json: mblJson,
          hbl_json: hblJson,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP ${res.status}`);
      }
      const data = await res.json().catch(() => ({}));
      setSaveMsg('Shipment JSON saved.');
      onBuilt();
    } catch (e: any) {
      setSaveMsg(`Failed to save: ${e?.message || e}`);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 4000);
    }
  }


  // Working copies for backend use (not shown in UI)
  const [mblJson, setMblJson] = useState<any>(shipmentData.mblRawJson);
  const [hblJson, setHblJson] = useState<any>(shipmentData.hblRawJson);

  // Which side was chosen per field path
  const [choices, setChoices] = useState<Record<string, ChoiceSide>>({});

  // Build rows from ORIGINALS only (UI stays constant)
  const validationData: ValidationField[] = useMemo(() => {
    return fieldsToValidate.map(({ label, path }) => {
      const mblVal = getAt(shipmentData.mblRawJson, path);
      const hblVal = getAt(shipmentData.hblRawJson, path);
      const status: FieldStatus = normalize(mblVal) === normalize(hblVal) ? 'match' : 'mismatch';
      return { label, path, mblValue: mblVal ?? null, hblValue: hblVal ?? null, status };
    });
  }, [shipmentData.mblRawJson, shipmentData.hblRawJson]);

  // Choosing resolves the row visually and affects counters, but UI values remain unchanged
  const applyChoice = (path: string, side: ChoiceSide, value: any) => {
    setMblJson(prev => setNested(prev, path, value));
    setHblJson(prev => setNested(prev, path, value));
    setChoices(prev => ({ ...prev, [path]: side }));
  };

  // A row is "resolved" if originals match OR the user picked a side
  const resolvedCount = validationData.filter(
    f => f.status === 'match' || choices[f.path] !== undefined
  ).length;
  const mismatchCount = validationData.length - resolvedCount;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900">Document Validation</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>{resolvedCount} Matches</span>
            </div>
            <div className="flex items-center space-x-1 text-orange-600">
              <AlertCircle className="w-4 h-4" />
              <span>{mismatchCount} Discrepancies</span>
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          Shipment ID: <span className="font-medium text-slate-900">{shipmentData.shipmentId}</span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {validationData.map((field, idx) => {
            const originalMatch = field.status === 'match';
            const chosen = choices[field.path]; // 'mbl' | 'hbl' | undefined
            const isResolved = originalMatch || chosen !== undefined;

            return (
              <Card
                key={idx}
                className={`border-2 ${isResolved ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs flex items-center justify-between">
                    <span>{field.label}</span>
                    {isResolved ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-orange-600" />
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  {originalMatch ? (
                    <div className="space-y-2">
                      <div className="p-2 bg-white rounded border border-green-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <FileText className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-slate-500">MBL</span>
                        </div>
                        <div className="text-xs font-medium text-slate-900">{String(field.mblValue ?? '')}</div>
                      </div>
                      <div className="p-2 bg-white rounded border border-green-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <FileText className="w-3 h-3 text-purple-600" />
                          <span className="text-xs text-slate-500">HBL</span>
                        </div>
                        <div className="text-xs font-medium text-slate-900">{String(field.hblValue ?? '')}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div
                        className={`p-2 bg-white rounded border cursor-pointer transition-colors ${
                          chosen === 'mbl'
                            ? 'border-green-400 ring-1 ring-green-300'
                            : 'border-slate-200 hover:border-blue-400'
                        }`}
                        onClick={() => applyChoice(field.path, 'mbl', field.mblValue)}
                        title="Choose MBL value (applies to working copy only)"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 mb-1">
                            <FileText className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-slate-500">MBL</span>
                          </div>
                          {chosen === 'mbl' && <Check className="w-3 h-3 text-green-600" />}
                        </div>
                        <div className="text-xs font-medium text-slate-900">{String(field.mblValue ?? '')}</div>
                      </div>

                      <div
                        className={`p-2 bg-white rounded border cursor-pointer transition-colors ${
                          chosen === 'hbl'
                            ? 'border-green-400 ring-1 ring-green-300'
                            : 'border-slate-200 hover:border-blue-400'
                        }`}
                        onClick={() => applyChoice(field.path, 'hbl', field.hblValue)}
                        title="Choose HBL value (applies to working copy only)"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 mb-1">
                            <FileText className="w-3 h-3 text-purple-600" />
                            <span className="text-xs text-slate-500">HBL</span>
                          </div>
                          {chosen === 'hbl' && <Check className="w-3 h-3 text-green-600" />}
                        </div>
                        <div className="text-xs font-medium text-slate-900">{String(field.hblValue ?? '')}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
        <Button onClick={handleConfirm} disabled={!mblJson || !hblJson}>
            {saving ? 'Building…' : 'complete validation'}
          </Button>
          {saveMsg && <div className="mt-2 text-sm text-slate-600">{saveMsg}</div>}
        </div>
      </div>
    </div>
  );
};

export default ValidationFields;
