
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, FileText } from 'lucide-react';

const DeclarationFormDetails = () => {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Customs Declaration Form</h2>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending Approval
          </Badge>
        </div>

        {/* Form Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Declaration Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Declaration Number</label>
                <p className="text-slate-900">CD-2024-001234</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Shipment Reference</label>
                <p className="text-slate-900">MBL-12345</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Total Value</label>
                <p className="text-slate-900">$2,000.00 USD</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Origin Country</label>
                <p className="text-slate-900">China</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commodity Details */}
        <Card>
          <CardHeader>
            <CardTitle>Commodity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-medium text-slate-700">Description</th>
                    <th className="text-left p-3 font-medium text-slate-700">HS Code</th>
                    <th className="text-left p-3 font-medium text-slate-700">Quantity</th>
                    <th className="text-left p-3 font-medium text-slate-700">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3 text-slate-700">Electronic Components - Capacitors</td>
                    <td className="p-3 text-slate-700">8532.24.00</td>
                    <td className="p-3 text-slate-700">500 pcs</td>
                    <td className="p-3 text-slate-700">$1,250.00</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 text-slate-700">Electronic Components - Resistors</td>
                    <td className="p-3 text-slate-700">8533.21.00</td>
                    <td className="p-3 text-slate-700">1000 pcs</td>
                    <td className="p-3 text-slate-700">$750.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Validation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Validation Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-slate-700">Document completeness verified</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-slate-700">HS codes validated</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-slate-700">Value calculations confirmed</span>
            </div>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-slate-700">Awaiting final approval</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <Button className="bg-green-600 hover:bg-green-700 flex-1">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve & Submit
          </Button>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            Request Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeclarationFormDetails;
