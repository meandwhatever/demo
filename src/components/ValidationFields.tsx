import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shipment } from '@/components/ShipmentDetails';

/*
hbl json structure:
{
  "shipper": {
    "name":              "",  // String
    "address":           "",  // String

  },
  "consignee": {
    "name":            "",  // String
    "address":         "",  // String

  },
  "notify_party": {
    "name":         "",  // String
    "address":      "",  // String

  },
  "shipment": {
    "hbl_number": "",  // String
    "mbl_number": "",  // String
    "vessel_name":                  "",  // String
    "voyage_number":                "",  // String
    "port_of_loading":              "",  // String
    "port_of_discharge":            "",  // String
    "place_of_receipt":             "",  // String
    "place_of_delivery":            "",  // String
    "place_of_issue":             "",  // String
    "date_of_issue":              null,  // String (ISO Date)
    "shipped_on_board_date":        null   // String (ISO Date)
    "mode":            "",  // String (e.g. "FCL", "LCL", "AIR")
    "freight_term":    "",  // String (e.g. "Prepaid", "Collect")
    "freight_service": ""   // String (e.g. "Door‑to‑Door")
    "total_number_of_containers": null,  // Number (integer)
    "total_weight":               null,  // String (e.g. "10000 kg")
    "total_volume":               null,  // String (e.g. "10000 m3")
    "total_package":              null   // String (e.g. "10000 pcs")
  },


  "freight_charges": [
    {
      "charge_name": "",  // String
      "rate":        null,  // Number
      "quantity":    null,  // Number (integer)
      "unit(Currency)": "",  //String
      "amount":      null,  // Number
      "prepaid or collect":   "",  // String(write "prepaid" or "collect", or "" if not found)

    }
    // … repeat for each line item
  ],
  "containers": [
    {
      "container_number":            "",  // String
      "seal_number":                 "",  // String
      "container_type":              "",  // String
      "number_of_packages":          null,  // Number (integer)
      "package_uom":                 "",  // String
      "weight":                      null,  // Number
      "weight_uom":                  "",  // String
      "volume":                      null,  // Number
      "volume_uom":                  "",  // String
      "product_item_description":    "",  // String
      "product_item_hscode":         ""   // String
    }
    // … repeat for each container
  ]
}

mbl json structure:
{
  "shipper": {
    "name":              "",  // String
    "address":           "",  // String

  },
  "consignee": {
    "name":            "",  // String
    "address":         "",  // String

  },
  "notify_party": {
    "name":         "",  // String
    "address":      "",  // String

  },
  "shipment": {
    "mbl_number": "",  // String
    "carrier_scac_code":            "",  // String
    "carrier_booking_number":       "",  // String
    "vessel_name":                  "",  // String
    "voyage_number":                "",  // String
    "port_of_loading":              "",  // String
    "port_of_discharge":            "",  // String
    "place_of_receipt":             "",  // String
    "place_of_delivery":            "",  // String
    "place_of_release":             "",  // String
    "date_of_release":              null,  // String (ISO Date)
    "shipped_on_board_date":        null   // String (ISO Date)
    "mode":            "",  // String (e.g. "FCL", "LCL")
    "freight_term":    "",  // String (e.g. "Prepaid", "Collect")
    "freight_service": ""   // String (e.g. "Door‑to‑Door")
    "total_number_of_containers": null,  // Number (integer)
    "total_weight":               null,  // String (e.g. "10000 kg")
    "total_volume":               null,  // String (e.g. "10000 m3")
    "total_package":              null   // String (e.g. "10000 pcs")
  },


  "freight_charges": [
    {
      "charge_name": "",  // String
      "rate":        null,  // Number
      "quantity":    null,  // Number (integer)
      "unit(Currency)": "",  //String
      "amount":      null,  // Number
      "prepaid or collect":   "",  // String(write "prepaid" or "collect", or "" if not found)

    }
    // … repeat for each line item
  ],
  "containers": [
    {
      "container_number":            "",  // String
      "seal_number":                 "",  // String
      "container_type":              "",  // String
      "number_of_packages":          null,  // Number (integer)
      "package_uom":                 "",  // String
      "weight":                      null,  // Number
      "weight_uom":                  "",  // String
      "volume":                      null,  // Number
      "volume_uom":                  "",  // String
      "product_item_description":    "",  // String
      "product_item_hscode":         ""   // String
    }
    // … repeat for each container
  ]
}
*/

type Json = any;

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between py-1">
    <span className="text-xs text-slate-500">{label}</span>
    <span className="text-xs font-medium text-slate-900 max-w-[60%] text-right break-words">
      {value ?? '-'}
    </span>
  </div>
);

const Section = ({
  title,
  leftTitle = 'MBL',
  rightTitle = 'HBL',
  left,
  right,
}: {
  title: string;
  leftTitle?: string;
  rightTitle?: string;
  left: React.ReactNode;
  right: React.ReactNode;
}) => (
  <div className="mb-4">
    <div className="text-sm font-semibold text-slate-900 mb-2">{title}</div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-slate-600">{leftTitle}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">{left}</CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-slate-600">{rightTitle}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">{right}</CardContent>
      </Card>
    </div>
  </div>
);

const ValidationFields = ({ shipmentData, onBuilt }: { shipmentData: Shipment, onBuilt: () => void }) => {
  const [mblJson, setMblJson] = useState<Json | null>(null);
  const [hblJson, setHblJson] = useState<Json | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Sync from parent each time shipmentData changes
  useEffect(() => {
    setMblJson(shipmentData?.mblRawJson ?? null);
    setHblJson(shipmentData?.hblRawJson ?? null);
  }, [shipmentData]);

  // Early exits if either is missing
  if (!mblJson && !hblJson) {
    return <div className="p-4 text-sm text-slate-700">Missing MBL and HBL JSON.</div>;
  }
  if (!mblJson) {
    return <div className="p-4 text-sm text-slate-700">Missing MBL JSON.</div>;
  }
  if (!hblJson) {
    return <div className="p-4 text-sm text-slate-700">Missing HBL JSON.</div>;
  }

  // Helpers
  const s = (v: any) => (v === null || v === undefined || v === '' ? '-' : String(v));

  // Shipper / Consignee
  const mShipper = mblJson?.shipper ?? {};
  const hShipper = hblJson?.shipper ?? {};
  const mConsignee = mblJson?.consignee ?? {};
  const hConsignee = hblJson?.consignee ?? {};

  // Shipment block fields
  const mShipment = mblJson?.shipment ?? {};
  const hShipment = hblJson?.shipment ?? {};

  // Vessel
  const mVessel = {
    vessel_name: mShipment?.vessel_name,
    voyage_number: mShipment?.voyage_number,
    shipped_on_board_date: mShipment?.shipped_on_board_date,
  };
  const hVessel = {
    vessel_name: hShipment?.vessel_name,
    voyage_number: hShipment?.voyage_number,
    shipped_on_board_date: hShipment?.shipped_on_board_date,
  };

  // Ports / Places
  const mPort = {
    port_of_loading: mShipment?.port_of_loading,
    port_of_discharge: mShipment?.port_of_discharge,
    place_of_receipt: mShipment?.place_of_receipt,
    place_of_delivery: mShipment?.place_of_delivery,
    place_of_release: mShipment?.place_of_release, // MBL specific
    date_of_release: mShipment?.date_of_release,
  };
  const hPort = {
    port_of_loading: hShipment?.port_of_loading,
    port_of_discharge: hShipment?.port_of_discharge,
    place_of_receipt: hShipment?.place_of_receipt,
    place_of_delivery: hShipment?.place_of_delivery,
    place_of_issue: hShipment?.place_of_issue, // HBL specific
    date_of_issue: hShipment?.date_of_issue,
  };

  // Containers
  const mContainers: Json[] = Array.isArray(mblJson?.containers) ? mblJson.containers : [];
  const hContainers: Json[] = Array.isArray(hblJson?.containers) ? hblJson.containers : [];

  // Freight Charges
  const mCharges: Json[] = Array.isArray(mblJson?.freight_charges) ? mblJson.freight_charges : [];
  const hCharges: Json[] = Array.isArray(hblJson?.freight_charges) ? hblJson.freight_charges : [];

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

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">data validation</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {/* 1) Shipper */}
        <Section
          title="Shipper"
          left={
            <div className="space-y-1">
              <Field label="Orgin agent name" value={s(mShipper?.name)} />
              <Field label="Orgin agent address" value={s(mShipper?.address)} />
            </div>
          }
          right={
            <div className="space-y-1">
              <Field label="Shipper name" value={s(hShipper?.name)} />
              <Field label="Shipper address" value={s(hShipper?.address)} />
            </div>
          }
        />

        {/* 2) Consignee */}
        <Section
          title="Consignee"
          left={
            <div className="space-y-1">
              <Field label="Destination agent name" value={s(mConsignee?.name)} />
              <Field label="Destination agent address" value={s(mConsignee?.address)} />
            </div>
          }
          right={
            <div className="space-y-1">
              <Field label="Consignee name" value={s(hConsignee?.name)} />
              <Field label="Consignee address" value={s(hConsignee?.address)} />
            </div>
          }
        />

        {/* 3) Vessel */}
        <Section
          title="Vessel"
          left={
            <div className="space-y-1">
              <Field label="Vessel Name" value={s(mVessel?.vessel_name)} />
              <Field label="Voyage #" value={s(mVessel?.voyage_number)} />
              <Field label="Shipped On Board" value={s(mVessel?.shipped_on_board_date)} />
            </div>
          }
          right={
            <div className="space-y-1">
              <Field label="Vessel Name" value={s(hVessel?.vessel_name)} />
              <Field label="Voyage #" value={s(hVessel?.voyage_number)} />
              <Field label="Shipped On Board" value={s(hVessel?.shipped_on_board_date)} />
            </div>
          }
        />

        {/* 4) Port */}
        <Section
          title="Port / Places"
          left={
            <div className="space-y-1">
              <Field label="Port of Loading" value={s(mPort.port_of_loading)} />
              <Field label="Port of Discharge" value={s(mPort.port_of_discharge)} />
              <Field label="Place of Receipt" value={s(mPort.place_of_receipt)} />
              <Field label="Place of Delivery" value={s(mPort.place_of_delivery)} />
              <Field label="Place of Release" value={s(mPort.place_of_release)} />
              <Field label="Date of Release" value={s(mPort.date_of_release)} />
            </div>
          }
          right={
            <div className="space-y-1">
              <Field label="Port of Loading" value={s(hPort.port_of_loading)} />
              <Field label="Port of Discharge" value={s(hPort.port_of_discharge)} />
              <Field label="Place of Receipt" value={s(hPort.place_of_receipt)} />
              <Field label="Place of Delivery" value={s(hPort.place_of_delivery)} />
              <Field label="Place of Issue" value={s(hPort.place_of_issue)} />
              <Field label="Date of Issue" value={s(hPort.date_of_issue)} />
            </div>
          }
        />

        {/* 5) Containers */}
        <div className="mb-2 text-sm font-semibold text-slate-900">Containers</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* MBL Containers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-600">MBL</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {mContainers.length === 0 ? (
                <div className="text-xs text-slate-500">No containers found.</div>
              ) : (
                mContainers.map((c, i) => (
                  <div key={i} className="rounded border p-2">
                    <Field label="Container #" value={s(c?.container_number)} />
                    <Field label="Seal #" value={s(c?.seal_number)} />
                    <Field label="Type" value={s(c?.container_type)} />
                    <Field
                      label="Packages"
                      value={c?.number_of_packages != null ? `${c.number_of_packages} ${s(c?.package_uom)}` : '-'}
                    />
                    <Field label="Weight" value={c?.weight != null ? `${c.weight} ${s(c?.weight_uom)}` : '-'} />
                    <Field label="Volume" value={c?.volume != null ? `${c.volume} ${s(c?.volume_uom)}` : '-'} />
                    <Field label="Description" value={s(c?.product_item_description)} />
                    <Field label="HS Code" value={s(c?.product_item_hscode)} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* HBL Containers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-600">HBL</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {hContainers.length === 0 ? (
                <div className="text-xs text-slate-500">No containers found.</div>
              ) : (
                hContainers.map((c, i) => (
                  <div key={i} className="rounded border p-2">
                    <Field label="Container #" value={s(c?.container_number)} />
                    <Field label="Seal #" value={s(c?.seal_number)} />
                    <Field label="Type" value={s(c?.container_type)} />
                    <Field
                      label="Packages"
                      value={c?.number_of_packages != null ? `${c.number_of_packages} ${s(c?.package_uom)}` : '-'}
                    />
                    <Field label="Weight" value={c?.weight != null ? `${c.weight} ${s(c?.weight_uom)}` : '-'} />
                    <Field label="Volume" value={c?.volume != null ? `${c.volume} ${s(c?.volume_uom)}` : '-'} />
                    <Field label="Description" value={s(c?.product_item_description)} />
                    <Field label="HS Code" value={s(c?.product_item_hscode)} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* 6) Freight Charges */}
        <div className="mt-6 mb-2 text-sm font-semibold text-slate-900">Freight Charges</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* MBL Charges */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-600">MBL</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {mCharges.length === 0 ? (
                <div className="text-xs text-slate-500">No charges found.</div>
              ) : (
                mCharges.map((c, i) => (
                  <div key={i} className="rounded border p-2">
                    <Field label="Charge Name" value={s(c?.charge_name)} />
                    <Field label="Rate" value={c?.rate != null ? String(c.rate) : '-'} />
                    <Field label="Quantity" value={c?.quantity != null ? String(c.quantity) : '-'} />
                    <Field label="Unit (Currency)" value={s(c?.['unit(Currency)'] ?? c?.unit ?? c?.currency)} />
                    <Field label="Amount" value={c?.amount != null ? String(c.amount) : '-'} />
                    <Field label="Prepaid/Collect" value={s(c?.['prepaid or collect'] ?? c?.terms)} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* HBL Charges */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-600">HBL</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {hCharges.length === 0 ? (
                <div className="text-xs text-slate-500">No charges found.</div>
              ) : (
                hCharges.map((c, i) => (
                  <div key={i} className="rounded border p-2">
                    <Field label="Charge Name" value={s(c?.charge_name)} />
                    <Field label="Rate" value={c?.rate != null ? String(c.rate) : '-'} />
                    <Field label="Quantity" value={c?.quantity != null ? String(c.quantity) : '-'} />
                    <Field label="Unit (Currency)" value={s(c?.['unit(Currency)'] ?? c?.unit ?? c?.currency)} />
                    <Field label="Amount" value={c?.amount != null ? String(c.amount) : '-'} />
                    <Field label="Prepaid/Collect" value={s(c?.['prepaid or collect'] ?? c?.terms)} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <Button onClick={handleConfirm} disabled={saving || !mblJson || !hblJson}>
            {saving ? 'Building…' : 'Confirm and Create Shipment'}
          </Button>
          {saveMsg && <span className="text-xs text-slate-600">{saveMsg}</span>}
        </div>
      </div>
    </div>
  );
};

export default ValidationFields;
