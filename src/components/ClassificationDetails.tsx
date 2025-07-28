//currently not used

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SKUData {
  id: string;
  skuId: string;
  productTitle: string;
  productDescription: string;
  hsCode: string;
  confidenceLevel: number;
  dutyRate: string;
}

interface ClassificationDetailsProps {
  title: string;
  onClose: () => void;
}

const ClassificationDetails = ({ title, onClose }: ClassificationDetailsProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editingHSCode, setEditingHSCode] = useState<string | null>(null);
  const [tempHSCode, setTempHSCode] = useState<string>('');

  // Mock data - in real app this would come from props or API
  const skuData: SKUData[] = [
    {
      id: '1',
      skuId: 'SKU-001',
      productTitle: 'Wireless Bluetooth Headphones',
      productDescription: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
      hsCode: '8518.30.20',
      confidenceLevel: 85,
      dutyRate: '12.5%'
    },
    {
      id: '2',
      skuId: 'SKU-002',
      productTitle: 'Smart Fitness Tracker',
      productDescription: 'Water-resistant fitness tracker with heart rate monitor and GPS',
      hsCode: '9102.12.80',
      confidenceLevel: 92,
      dutyRate: '8.0%'
    },
    {
      id: '3',
      skuId: 'SKU-003',
      productTitle: 'LED Desk Lamp',
      productDescription: 'Adjustable LED desk lamp with USB charging port and touch controls',
      hsCode: '9405.20.60',
      confidenceLevel: 78,
      dutyRate: '15.2%'
    }
  ];

  const handleRowClick = (skuId: string) => {
    setExpandedRow(expandedRow === skuId ? null : skuId);
    setEditingHSCode(null);
  };

  const handleEditHSCode = (skuId: string, currentHSCode: string) => {
    setEditingHSCode(skuId);
    setTempHSCode(currentHSCode);
  };

  const handleConfirmHSCode = () => {
    // In real app, this would update the data
    console.log('Updating HS Code to:', tempHSCode);
    setEditingHSCode(null);
    setExpandedRow(null);
  };

  const handleCancelEdit = () => {
    setEditingHSCode(null);
    setTempHSCode('');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50';
    if (confidence >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-[calc(100%-80px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU ID</TableHead>
                <TableHead>Product Title</TableHead>
                <TableHead>Product Description</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skuData.map((sku) => (
                <>
                  <TableRow
                    key={sku.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleRowClick(sku.id)}
                  >
                    <TableCell className="font-medium">{sku.skuId}</TableCell>
                    <TableCell>{sku.productTitle}</TableCell>
                    <TableCell className="max-w-xs truncate">{sku.productDescription}</TableCell>
                    <TableCell>
                      {expandedRow === sku.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRow === sku.id && (
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <div className="p-4 bg-slate-50 border-t">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-slate-700">HS Code</label>
                              {editingHSCode === sku.id ? (
                                <div className="flex items-center space-x-2 mt-1">
                                  <Input
                                    value={tempHSCode}
                                    onChange={(e) => setTempHSCode(e.target.value)}
                                    className="flex-1"
                                    placeholder="Enter HS Code"
                                  />
                                  <Button size="sm" onClick={handleConfirmHSCode}>
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-sm">{sku.hsCode}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditHSCode(sku.id, sku.hsCode)}
                                  >
                                    Edit
                                  </Button>
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-slate-700">Duty Rate</label>
                              <p className="text-sm mt-1">{sku.dutyRate}</p>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-slate-700">Confidence Level</label>
                              <div className="mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(sku.confidenceLevel)}`}>
                                  {sku.confidenceLevel}%
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-slate-700">Justification</label>
                              <Button variant="link" size="sm" className="mt-1 p-0 h-auto">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassificationDetails;
