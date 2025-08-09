import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shipment } from './ShipmentDetails';

interface ShipmentDetailsPanelProps {
  shipment: Shipment;
}

const LabelRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between py-1">
    <span className="text-xs text-slate-500">{label}</span>
    <span className="text-xs font-medium text-slate-900 max-w-[65%] text-right break-words">
      {value ?? '-'}
    </span>
  </div>
);

const s = (v: any) => (v === null || v === undefined || v === '' ? '-' : String(v));

const ShipmentDetailsPanel = ({ shipment }: ShipmentDetailsPanelProps) => {
  const data: any = shipment?.rawJson || null;

  if (!data) {
    return <div className="p-6 text-sm text-slate-600">Missing shipment JSON.</div>;
  }

  const parties = data.involved_party ?? {};
  const ship = data.shipment ?? {};
  const containers: any[] = Array.isArray(data.containers) ? data.containers : [];
  const charges: any[] = Array.isArray(data.freight_charges) ? data.freight_charges : [];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Shipment Details</h2>

      {/* 1) Involved Parties */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Involved Parties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <LabelRow label="Shipper Name" value={s(parties.shipper_name)} />
              <LabelRow label="Shipper Address" value={s(parties.shipper_address)} />
              <LabelRow label="Consignee Name" value={s(parties.consignee_name)} />
              <LabelRow label="Consignee Address" value={s(parties.consignee_address)} />
            </div>
            <div className="space-y-1">
              {/* Note: source uses 'orgin_*' in builder */}
              <LabelRow label="Origin Agent Name" value={s(parties.orgin_agent_name)} />
              <LabelRow label="Origin Agent Address" value={s(parties.orgin_agent_address)} />
              <LabelRow label="Destination Agent Name" value={s(parties.destination_agent_name)} />
              <LabelRow label="Destination Agent Address" value={s(parties.destination_agent_address)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2) Shipment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <LabelRow label="Master B/L Number" value={s(ship.master_bill_of_lading_number)} />
              <LabelRow label="House B/L Number" value={s(ship.house_bill_of_lading_number)} />
              <LabelRow label="Vessel Name" value={s(ship.vessel_name)} />
              <LabelRow label="Voyage #" value={s(ship.voyage_number)} />
              <LabelRow label="Freight Mode" value={s(ship.freight_mode)} />
            </div>
            <div className="space-y-1">
              <LabelRow label="Port of Loading" value={s(ship.port_of_loading)} />
              <LabelRow label="Port of Discharge" value={s(ship.port_of_discharge)} />
              <LabelRow label="Place of Receipt" value={s(ship.place_of_receipt)} />
              <LabelRow label="Place of Delivery" value={s(ship.place_of_delivery)} />
              <LabelRow label="# Containers" value={s(ship.total_number_of_containers)} />
              <LabelRow label="Total Weight" value={s(ship.total_weight)} />
              <LabelRow label="Total Volume" value={s(ship.total_volume)} />
              <LabelRow label="Total Package" value={s(ship.total_package)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3) Containers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Containers</CardTitle>
        </CardHeader>
        <CardContent>
          {containers.length === 0 ? (
            <div className="text-xs text-slate-500">No containers found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Container #</TableHead>
                  <TableHead>Seal #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Packages</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>HS Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containers.map((c, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{s(c?.container_number)}</TableCell>
                    <TableCell>{s(c?.seal_number)}</TableCell>
                    <TableCell>{s(c?.container_type)}</TableCell>
                    <TableCell>
                      {c?.number_of_packages != null
                        ? `${c.number_of_packages} ${s(c?.package_uom)}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {c?.weight != null ? `${c.weight} ${s(c?.weight_uom)}` : '-'}
                    </TableCell>
                    <TableCell>
                      {c?.volume != null ? `${c.volume} ${s(c?.volume_uom)}` : '-'}
                    </TableCell>
                    <TableCell>{s(c?.product_item_description)}</TableCell>
                    <TableCell>{s(c?.product_item_hscode)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 4) Freight Charges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Freight Charges</CardTitle>
        </CardHeader>
        <CardContent>
          {charges.length === 0 ? (
            <div className="text-xs text-slate-500">No charges found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Charge Name</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit (Currency)</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Prepaid/Collect</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {charges.map((c, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{s(c?.charge_name)}</TableCell>
                    <TableCell>{c?.rate != null ? String(c.rate) : '-'}</TableCell>
                    <TableCell>{c?.quantity != null ? String(c.quantity) : '-'}</TableCell>
                    <TableCell>{s(c?.['unit(Currency)'] ?? c?.unit ?? c?.currency)}</TableCell>
                    <TableCell>{c?.amount != null ? String(c.amount) : '-'}</TableCell>
                    <TableCell>{s(c?.['prepaid or collect'] ?? c?.terms)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentDetailsPanel;
