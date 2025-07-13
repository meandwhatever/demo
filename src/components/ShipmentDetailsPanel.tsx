
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ShipmentDetailsPanel = () => {
  const containerData = [
    {
      containerId: 'MSKU7654321',
      sealId: '12345678',
      containerType: '40\' HC',
      weight: '15,000 KGS',
      volume: '67.5 CBM'
    },
    {
      containerId: 'TCLU9876543',
      sealId: '87654321',
      containerType: '20\' GP',
      weight: '8,500 KGS',
      volume: '28.2 CBM'
    }
  ];

  const productData = [
    {
      title: 'Electronic Components - Capacitors',
      description: 'High-quality ceramic capacitors for industrial use',
      hsCode: '8532.24.00',
      unit: '500 pcs',
      unitPrice: '$2.50',
      totalPrice: '$1,250.00'
    },
    {
      title: 'Electronic Components - Resistors',
      description: 'Carbon film resistors, various resistance values',
      hsCode: '8533.21.00',
      unit: '1000 pcs',
      unitPrice: '$0.75',
      totalPrice: '$750.00'
    },
    {
      title: 'Circuit Boards',
      description: 'Printed circuit boards for electronic devices',
      hsCode: '8534.00.00',
      unit: '100 pcs',
      unitPrice: '$15.00',
      totalPrice: '$1,500.00'
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Shipment Details</h2>
      
      <div className="space-y-6">
        {/* Involved Party Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Involved Party</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Shipper</h4>
                <p className="text-sm text-slate-700">
                  ABC Manufacturing Co.<br/>
                  123 Industrial Drive<br/>
                  Shanghai, China 200000<br/>
                  Tel: +86-21-1234-5678
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Consignee</h4>
                <p className="text-sm text-slate-700">
                  XYZ Imports LLC<br/>
                  456 Commerce Street<br/>
                  Los Angeles, CA 90210<br/>
                  Tel: +1-555-123-4567
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipment Data Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shipment Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Origin</h4>
                <p className="text-sm text-slate-700">Port of Shanghai, China</p>
                <h4 className="font-medium text-slate-900 mb-2 mt-4">Vessel</h4>
                <p className="text-sm text-slate-700">MSC MAGNIFICENT / V.234E</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Destination</h4>
                <p className="text-sm text-slate-700">Port of Los Angeles, USA</p>
                <h4 className="font-medium text-slate-900 mb-2 mt-4">Status</h4>
                <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Container Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Container</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Container ID</TableHead>
                  <TableHead>Seal ID</TableHead>
                  <TableHead>Container Type</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containerData.map((container, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{container.containerId}</TableCell>
                    <TableCell>{container.sealId}</TableCell>
                    <TableCell>{container.containerType}</TableCell>
                    <TableCell>{container.weight}</TableCell>
                    <TableCell>{container.volume}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Product Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Title</TableHead>
                  <TableHead>Product Description</TableHead>
                  <TableHead>HS Code</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productData.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.hsCode}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>{product.unitPrice}</TableCell>
                    <TableCell>{product.totalPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShipmentDetailsPanel;
