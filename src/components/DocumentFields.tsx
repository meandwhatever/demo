/*
hbl json:


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

*/
import { useState } from 'react';
import { Save, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentFieldsProps {
  documentType?: string;
  rawJson?: Record<string, any>;
  docId: string;
}

const DocumentFields = ({ documentType = 'Commercial Invoice', rawJson, docId }: DocumentFieldsProps) => {
  documentType = documentType.toLowerCase();
  const [jsonBackupData, setJsonBackupData] = useState<Record<string, any>>(rawJson);

  const [jsonData, setJsonData] = useState<Record<string, any>>(rawJson);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    // Save logic would go here
    console.log('Saving document data:', jsonData);
    setIsEditing(false);
    setJsonBackupData(jsonData)
    try {
      const res = await fetch('/api/update/doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: docId,                 // DB row id you received as prop
          rawJson: jsonData,         // edited data
          fileType: documentType.toLowerCase() // "mbl" or "hbl"
        }),
      });
  
      if (!res.ok) {
        // bubble up API‑side error message if any
        const { error } = await res.json();
        throw new Error(error ?? `HTTP ${res.status}`);
      }
  
      // success: keep the new values as the backup baseline
      setJsonBackupData(jsonData);
      setIsEditing(false);
      console.log('Saved document', await res.json());
    } catch (err) {
      console.error('Save failed:', err);
      // optional: toast or revert UI here
    }

  };

  const handleCancel = () => {
    setIsEditing(false);
    setJsonData(jsonBackupData)
    // Reset to original values logic would go here
  };

  const handleChange = (section: string, key: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === "number" ? e.target.valueAsNumber : e.target.value;
    setJsonData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };
  //universal handle change function for all inputs that are arrays
  const handleArrayChange = (arrayKey: string, index: number, key: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === "number" ? e.target.valueAsNumber : e.target.value;
    setJsonData((prev) => {
      const updated = [...prev[arrayKey]];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, [arrayKey]: updated };
    });
  };
  //for mbl and hbl
  const handleAddFreightCharge = () => {
    setJsonData((prev) => ({
      ...prev,
      freight_charges: Array.isArray(prev.freight_charges)
        ? [...prev.freight_charges, { charge_type: '', amount: 0, currency: '' }]
        : [{ charge_type: '', amount: 0, currency: '' }],
    }));
  };
  const handleDeleteFreightCharge = (index: number) => {
    setJsonData((prev) => ({
      ...prev,
      freight_charges: prev.freight_charges.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleAddContainer = () => {
    setJsonData((prev) => ({
      ...prev,
      containers: Array.isArray(prev.containers)
        ? [...prev.containers, {
            container_number: '',
            seal_number: '',
            container_type: '',
            number_of_packages: 0,
            package_uom: '',
            weight: 0,
            weight_uom: '',
            volume: 0,
            volume_uom: '',
            product_item_description: '',
            product_item_hscode: '',
          }]
        : [{
            container_number: '',
            seal_number: '',
            container_type: '',
            number_of_packages: 0,
            package_uom: '',
            weight: 0,
            weight_uom: '',
            volume: 0,
            volume_uom: '',
            product_item_description: '',
            product_item_hscode: '',
          }],
    }));
  };
  const handleDeleteContainer = (index: number) => {
    setJsonData((prev) => ({
      ...prev,
      containers: prev.containers.filter((_: any, i: number) => i !== index),
    }));
  };



  const renderFields = () => {
    switch (documentType) {
      case 'mbl':
        return (
          <>
            <h1>caseMBL</h1>
            <h1>docId: {docId}</h1>
            <h1>blNumber: {rawJson.shipment.mbl_number}</h1>
            {/* shipper */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Shipper</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-slate-600">name</Label>
                    <Input
                      
                      value={jsonData.shipper.name}
                      onChange={handleChange('shipper', 'name')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">address</Label>
                    <Input
                      value={jsonData.shipper.address}
                      onChange={handleChange('shipper', 'address')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* consignee */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Consignee</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-slate-600">name</Label>
                    <Input
                      
                      value={jsonData.consignee.name}
                      onChange={handleChange('consignee', 'name')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">address</Label>
                    <Input
                      value={jsonData.consignee.address}
                      onChange={handleChange('consignee', 'address')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* notify party */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Notify Party</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-slate-600">name</Label>
                    <Input
                      
                      value={jsonData.notify_party.name}
                      onChange={handleChange('notify_party', 'name')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">address</Label>
                    <Input
                      value={jsonData.notify_party.address}
                      onChange={handleChange('notify_party', 'address')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* shipment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Shipment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-slate-600">mbl number</Label>
                    <Input
                      
                      value={jsonData.shipment.mbl_number}
                      onChange={handleChange('shipment', 'mbl_number')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">carrier scac code</Label>
                    <Input
                      value={jsonData.shipment.carrier_scac_code}
                      onChange={handleChange('shipment', 'carrier_scac_code')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">carrier booking number</Label>
                    <Input
                      value={jsonData.shipment.carrier_booking_number}
                      onChange={handleChange('shipment', 'carrier_booking_number')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">vessel name</Label>
                    <Input
                      value={jsonData.shipment.vessel_name}
                      onChange={handleChange('shipment', 'vessel_name')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">voyage number</Label>
                    <Input
                      value={jsonData.shipment.voyage_number}
                      onChange={handleChange('shipment', 'voyage_number')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">port of loading</Label>
                    <Input
                      value={jsonData.shipment.port_of_loading}
                      onChange={handleChange('shipment', 'port_of_loading')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">port of discharge</Label>
                    <Input
                      value={jsonData.shipment.port_of_discharge}
                      onChange={handleChange('shipment', 'port_of_discharge')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">place of receipt</Label>
                    <Input
                      value={jsonData.shipment.place_of_receipt}
                      onChange={handleChange('shipment', 'place_of_receipt')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">place of delivery</Label>
                    <Input
                      value={jsonData.shipment.place_of_delivery}
                      onChange={handleChange('shipment', 'place_of_delivery')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">place of release</Label>
                    <Input
                      value={jsonData.shipment.place_of_release}
                      onChange={handleChange('shipment', 'place_of_release')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">date of release</Label>
                    <Input
                      value={jsonData.shipment.date_of_release}
                      onChange={handleChange('shipment', 'date_of_release')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">shipped on board date</Label>
                    <Input
                      value={jsonData.shipment.shipped_on_board_date}
                      onChange={handleChange('shipment', 'shipped_on_board_date')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">mode</Label>
                    <Input
                      value={jsonData.shipment.mode}
                      onChange={handleChange('shipment', 'mode')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">freight term</Label>
                    <Input
                      value={jsonData.shipment.freight_term}
                      onChange={handleChange('shipment', 'freight_term')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">freight service</Label>
                    <Input
                      value={jsonData.shipment.freight_service}
                      onChange={handleChange('shipment', 'freight_service')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">total number of containers</Label>
                    <Input
                      value={jsonData.shipment.total_number_of_containers}
                      onChange={handleChange('shipment', 'total_number_of_containers')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">total weight</Label>
                    <Input
                      value={jsonData.shipment.total_weight}
                      onChange={handleChange('shipment', 'total_weight')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">total volume</Label>
                    <Input
                      value={jsonData.shipment.total_volume}
                      onChange={handleChange('shipment', 'total_volume')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">total package</Label>
                    <Input
                      value={jsonData.shipment.total_package}
                      onChange={handleChange('shipment', 'total_package')}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* inplment the rest of the fields here, use handleArrayChange for onchange  */}
            {/* freight charges */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">
                  Freight Charges
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {Array.isArray(jsonData.freight_charges) && jsonData.freight_charges.length ? (
                  jsonData.freight_charges.map((charge, idx) => (
                    <Card key={idx} className="relative border border-slate-200 p-4">
                      {/* ⓧ delete row */}
                      {isEditing && (
                        <Button
                          onClick={() => handleDeleteFreightCharge(idx)}
                          size="icon"
                          variant="ghost"
                          className="absolute -right-2 -top-2 rounded-full hover:bg-red-50"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      )}

                      <div className="grid grid-cols-6 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-slate-600">Charge Name</Label>
                        <Input
                          value={charge.charge_name}
                          onChange={handleArrayChange('freight_charges', idx, 'charge_name')}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-slate-600">Rate</Label>
                        <Input
                          type="number"
                          value={charge.rate ?? ''}
                          onChange={handleArrayChange('freight_charges', idx, 'rate')}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-slate-600">Quantity</Label>
                        <Input
                          type="number"
                          value={charge.quantity ?? ''}
                          onChange={handleArrayChange('freight_charges', idx, 'quantity')}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-slate-600">Unit (Currency)</Label>
                        <Input
                          value={charge['unit(Currency)']}
                          onChange={handleArrayChange('freight_charges', idx, 'unit(Currency)')}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-slate-600">Amount</Label>
                        <Input
                          type="number"
                          value={charge.amount ?? ''}
                          onChange={handleArrayChange('freight_charges', idx, 'amount')}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-slate-600">Prepaid / Collect</Label>
                        <Input
                          value={charge['prepaid or collect']}
                          onChange={handleArrayChange('freight_charges', idx, 'prepaid or collect')}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No freight charges found.</p>
                )}
              </CardContent>

              {/* ➕ add new row */}
              {isEditing && (
                <div className="p-4 pt-0">
                  <Button
                    onClick={handleAddFreightCharge}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Add freight charge
                  </Button>
                </div>
              )}
            </Card>


            {/* containers */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">
                  Containers
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {Array.isArray(jsonData.containers) && jsonData.containers.length ? (
                  jsonData.containers.map((cntr, idx) => (
                    <Card key={idx} className="relative border border-slate-200 p-4">
                      {/* ⓧ delete row */}
                      {isEditing && (
                        <Button
                          onClick={() => handleDeleteContainer(idx)}
                          size="icon"
                          variant="ghost"
                          className="absolute -right-2 -top-2 rounded-full hover:bg-red-50"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      )}

                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-slate-600">Container No.</Label>
                          <Input
                            value={cntr.container_number}
                            onChange={handleArrayChange('containers', idx, 'container_number')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600">Seal No.</Label>
                          <Input
                            value={cntr.seal_number}
                            onChange={handleArrayChange('containers', idx, 'seal_number')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600">Type</Label>
                          <Input
                            value={cntr.container_type}
                            onChange={handleArrayChange('containers', idx, 'container_type')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600"># Packages</Label>
                          <Input
                            type="number"
                            value={cntr.number_of_packages ?? ''}
                            onChange={handleArrayChange('containers', idx, 'number_of_packages')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600">Pkg UOM</Label>
                          <Input
                            value={cntr.package_uom}
                            onChange={handleArrayChange('containers', idx, 'package_uom')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600">Weight</Label>
                          <Input
                            type="number"
                            value={cntr.weight ?? ''}
                            onChange={handleArrayChange('containers', idx, 'weight')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600">Weight UOM</Label>
                          <Input
                            value={cntr.weight_uom}
                            onChange={handleArrayChange('containers', idx, 'weight_uom')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600">Volume</Label>
                          <Input
                            type="number"
                            value={cntr.volume ?? ''}
                            onChange={handleArrayChange('containers', idx, 'volume')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600">Volume UOM</Label>
                          <Input
                            value={cntr.volume_uom}
                            onChange={handleArrayChange('containers', idx, 'volume_uom')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs font-medium text-slate-600">Item Description</Label>
                          <Input
                            value={cntr.product_item_description}
                            onChange={handleArrayChange('containers', idx, 'product_item_description')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600">HS Code</Label>
                          <Input
                            value={cntr.product_item_hscode}
                            onChange={handleArrayChange('containers', idx, 'product_item_hscode')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No containers found.</p>
                )}
              </CardContent>

              {/* ➕ add new row */}
              {isEditing && (
                <div className="p-4 pt-0">
                  <Button
                    onClick={handleAddContainer}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Add container
                  </Button>
                </div>
              )}
            </Card>

          </>
        );
      case 'hbl':
        return (
          <h1>caseHBL to be implemented</h1>
        )


      default: // add later
        return (
          <h1>randerfields default, can't find document type</h1>
        )
      }

  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Digitized Fields</h2>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="ghost" size="sm">
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Document Fields - Scrollable */}
      <h1>doc type: {documentType}</h1>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="space-y-4">
            {renderFields()}
            
            {/* Common Parties Section for all document types */}

          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocumentFields;
