import { useState } from 'react';
import { Save, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentFieldsProps {
  documentType?: string;
}

const DocumentFields = ({ documentType = 'Commercial Invoice' }: DocumentFieldsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Different document data based on type
  const getDocumentData = (type: string) => {
    switch (type) {
      case 'MBL':
        return {
          blNumber: 'MBL-12345',
          date: '2024-03-15',
          shipper: 'ABC Manufacturing Co.',
          shipperAddress: '123 Industrial Drive, Shanghai, China 200000',
          consignee: 'XYZ Imports LLC',
          consigneeAddress: '456 Commerce Street, Los Angeles, CA 90210',
          vessel: 'MSC MAGNIFICENT',
          voyage: 'V.234E',
          containerNo: 'MSKU7654321',
          sealNo: '12345678'
        };
      case 'HBL':
        return {
          hblNumber: 'HBL-54321',
          date: '2024-03-15',
          shipper: 'DEF Trading Co.',
          shipperAddress: '789 Export Avenue, Guangzhou, China 510000',
          consignee: 'ABC Logistics Inc.',
          consigneeAddress: '321 Import Blvd, New York, NY 10001',
          cargoDescription: 'Electronic Components and Parts',
          weight: '15,000 KGS',
          volume: '25 CBM'
        };
      case 'Pack List':
        return {
          listNumber: 'PL-98765',
          date: '2024-03-15',
          shipper: 'ABC Manufacturing Co.',
          shipperAddress: '123 Industrial Drive, Shanghai, China 200000',
          totalItems: '80 pcs',
          totalWeight: '200.7 KG',
          totalVolume: '5.2 CBM',
          packingMethod: 'Wooden Crates'
        };
      default: // Commercial Invoice
        return {
          invoiceNumber: 'INV001234',
          date: '2024-03-15',
          shipper: 'ABC Manufacturing Co.',
          shipperAddress: '123 Industrial Drive, Shanghai, China 200000',
          consignee: 'XYZ Imports LLC',
          consigneeAddress: '456 Commerce Street, Los Angeles, CA 90210',
          totalAmount: '2000.00',
          currency: 'USD',
          description: 'Electronic Components',
          hsCode: '8532.25.00',
          quantity: '1500',
          unitPrice: '1.33'
        };
    }
  };

  const [documentData, setDocumentData] = useState(getDocumentData(documentType));

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
    console.log('Saving document data:', documentData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values logic would go here
  };

  const updateField = (field: string, value: string) => {
    setDocumentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderFields = () => {
    switch (documentType) {
      case 'MBL':
        return (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Bill of Lading Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="blNumber" className="text-xs font-medium text-slate-600">B/L Number</Label>
                    <Input
                      id="blNumber"
                      value={(documentData as any).blNumber}
                      onChange={(e) => updateField('blNumber', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-xs font-medium text-slate-600">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={(documentData as any).date}
                      onChange={(e) => updateField('date', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Vessel Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="vessel" className="text-xs font-medium text-slate-600">Vessel</Label>
                    <Input
                      id="vessel"
                      value={(documentData as any).vessel}
                      onChange={(e) => updateField('vessel', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="voyage" className="text-xs font-medium text-slate-600">Voyage</Label>
                    <Input
                      id="voyage"
                      value={(documentData as any).voyage}
                      onChange={(e) => updateField('voyage', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        );
      
      case 'HBL':
        return (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">House B/L Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="hblNumber" className="text-xs font-medium text-slate-600">H/B/L Number</Label>
                    <Input
                      id="hblNumber"
                      value={(documentData as any).hblNumber}
                      onChange={(e) => updateField('hblNumber', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-xs font-medium text-slate-600">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={(documentData as any).date}
                      onChange={(e) => updateField('date', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Cargo Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="cargoDescription" className="text-xs font-medium text-slate-600">Cargo Description</Label>
                  <Input
                    id="cargoDescription"
                    value={(documentData as any).cargoDescription}
                    onChange={(e) => updateField('cargoDescription', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="weight" className="text-xs font-medium text-slate-600">Weight</Label>
                    <Input
                      id="weight"
                      value={(documentData as any).weight}
                      onChange={(e) => updateField('weight', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="volume" className="text-xs font-medium text-slate-600">Volume</Label>
                    <Input
                      id="volume"
                      value={(documentData as any).volume}
                      onChange={(e) => updateField('volume', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        );
      
      case 'Pack List':
        return (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Packing List Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="listNumber" className="text-xs font-medium text-slate-600">List Number</Label>
                    <Input
                      id="listNumber"
                      value={(documentData as any).listNumber}
                      onChange={(e) => updateField('listNumber', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-xs font-medium text-slate-600">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={(documentData as any).date}
                      onChange={(e) => updateField('date', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Packing Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="totalItems" className="text-xs font-medium text-slate-600">Total Items</Label>
                    <Input
                      id="totalItems"
                      value={(documentData as any).totalItems}
                      onChange={(e) => updateField('totalItems', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalWeight" className="text-xs font-medium text-slate-600">Total Weight</Label>
                    <Input
                      id="totalWeight"
                      value={(documentData as any).totalWeight}
                      onChange={(e) => updateField('totalWeight', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        );
      
      default: // Commercial Invoice
        return (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Invoice Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="invoiceNumber" className="text-xs font-medium text-slate-600">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={(documentData as any).invoiceNumber}
                      onChange={(e) => updateField('invoiceNumber', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-xs font-medium text-slate-600">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={(documentData as any).date}
                      onChange={(e) => updateField('date', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Goods Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="description" className="text-xs font-medium text-slate-600">Description</Label>
                  <Input
                    id="description"
                    value={(documentData as any).description}
                    onChange={(e) => updateField('description', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="hsCode" className="text-xs font-medium text-slate-600">HS Code</Label>
                    <Input
                      id="hsCode"
                      value={(documentData as any).hsCode}
                      onChange={(e) => updateField('hsCode', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="text-xs font-medium text-slate-600">Quantity</Label>
                    <Input
                      id="quantity"
                      value={(documentData as any).quantity}
                      onChange={(e) => updateField('quantity', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="totalAmount" className="text-xs font-medium text-slate-600">Total Amount</Label>
                    <Input
                      id="totalAmount"
                      value={(documentData as any).totalAmount}
                      onChange={(e) => updateField('totalAmount', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency" className="text-xs font-medium text-slate-600">Currency</Label>
                    <Input
                      id="currency"
                      value={(documentData as any).currency}
                      onChange={(e) => updateField('currency', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        );
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
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="space-y-4">
            {renderFields()}
            
            {/* Common Parties Section for all document types */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Parties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="shipper" className="text-xs font-medium text-slate-600">Shipper</Label>
                  <Input
                    id="shipper"
                    value={(documentData as any).shipper}
                    onChange={(e) => updateField('shipper', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="shipperAddress" className="text-xs font-medium text-slate-600">Shipper Address</Label>
                  <Input
                    id="shipperAddress"
                    value={(documentData as any).shipperAddress}
                    onChange={(e) => updateField('shipperAddress', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="consignee" className="text-xs font-medium text-slate-600">Consignee</Label>
                  <Input
                    id="consignee"
                    value={(documentData as any).consignee}
                    onChange={(e) => updateField('consignee', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="consigneeAddress" className="text-xs font-medium text-slate-600">Consignee Address</Label>
                  <Input
                    id="consigneeAddress"
                    value={(documentData as any).consigneeAddress}
                    onChange={(e) => updateField('consigneeAddress', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocumentFields;
