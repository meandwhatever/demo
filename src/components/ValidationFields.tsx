
import { useState } from 'react';
import { CheckCircle, AlertCircle, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ValidationField {
  fieldName: string;
  mblValue: string;
  hblValue: string;
  status: 'match' | 'mismatch';
  selectedValue?: string;
}

const ValidationFields = () => {
  const [validationData, setValidationData] = useState<ValidationField[]>([
    {
      fieldName: 'Shipper Name',
      mblValue: 'ABC Manufacturing Co.',
      hblValue: 'ABC Manufacturing Co.',
      status: 'match'
    },
    {
      fieldName: 'Consignee Name',
      mblValue: 'XYZ Imports LLC',
      hblValue: 'XYZ Import Services LLC',
      status: 'mismatch'
    },
    {
      fieldName: 'Container Number',
      mblValue: 'MSKU7654321',
      hblValue: 'MSKU7654321',
      status: 'match'
    },
    {
      fieldName: 'Weight (KGS)',
      mblValue: '15,000',
      hblValue: '15,250',
      status: 'mismatch'
    },
    {
      fieldName: 'Port of Loading',
      mblValue: 'Shanghai, China',
      hblValue: 'Shanghai, China',
      status: 'match'
    },
    {
      fieldName: 'Port of Discharge',
      mblValue: 'Los Angeles, CA',
      hblValue: 'Long Beach, CA',
      status: 'mismatch'
    }
  ]);

  const handleValueSelection = (fieldIndex: number, selectedValue: string) => {
    setValidationData(prev => prev.map((field, index) => 
      index === fieldIndex 
        ? { ...field, selectedValue }
        : field
    ));
  };

  const handleShipmentClick = () => {
    // Navigate to shipment details page
    console.log('Navigate to shipment details');
  };

  const matchCount = validationData.filter(field => field.status === 'match').length;
  const mismatchCount = validationData.filter(field => field.status === 'mismatch').length;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900">Document Validation</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>{matchCount} Matches</span>
            </div>
            <div className="flex items-center space-x-1 text-orange-600">
              <AlertCircle className="w-4 h-4" />
              <span>{mismatchCount} Discrepancies</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleShipmentClick}
          className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
        >
          Shipment ID: SHP-MBL-12345
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {validationData.map((field, index) => (
            <Card key={index} className={`border-2 ${
              field.status === 'match' 
                ? 'border-green-200 bg-green-50' 
                : 'border-orange-200 bg-orange-50'
            }`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center justify-between">
                  <span>{field.fieldName}</span>
                  {field.status === 'match' ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-orange-600" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {field.status === 'match' ? (
                  <div className="space-y-2">
                    <div className="p-2 bg-white rounded border border-green-200">
                      <div className="flex items-center space-x-2 mb-1">
                        <FileText className="w-3 h-3 text-blue-600" />
                        <span className="text-xs text-slate-500">MBL</span>
                      </div>
                      <div className="text-xs font-medium text-slate-900">{field.mblValue}</div>
                    </div>
                    <div className="p-2 bg-white rounded border border-green-200">
                      <div className="flex items-center space-x-2 mb-1">
                        <FileText className="w-3 h-3 text-purple-600" />
                        <span className="text-xs text-slate-500">HBL</span>
                      </div>
                      <div className="text-xs font-medium text-slate-900">{field.hblValue}</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div 
                      className={`p-2 bg-white rounded border cursor-pointer transition-colors ${
                        field.selectedValue === field.mblValue 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handleValueSelection(index, field.mblValue)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 mb-1">
                          <FileText className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-slate-500">MBL</span>
                        </div>
                        {field.selectedValue === field.mblValue && (
                          <Check className="w-3 h-3 text-blue-600" />
                        )}
                      </div>
                      <div className="text-xs font-medium text-slate-900">{field.mblValue}</div>
                    </div>
                    
                    <div 
                      className={`p-2 bg-white rounded border cursor-pointer transition-colors ${
                        field.selectedValue === field.hblValue 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handleValueSelection(index, field.hblValue)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 mb-1">
                          <FileText className="w-3 h-3 text-purple-600" />
                          <span className="text-xs text-slate-500">HBL</span>
                        </div>
                        {field.selectedValue === field.hblValue && (
                          <Check className="w-3 h-3 text-blue-600" />
                        )}
                      </div>
                      <div className="text-xs font-medium text-slate-900">{field.hblValue}</div>
                    </div>
                    
                    {field.selectedValue && (
                      <div className="text-xs text-green-600 flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Selected: {field.selectedValue}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Complete Validation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValidationFields;
