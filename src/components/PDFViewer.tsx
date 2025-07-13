import { FileText, Download, ZoomIn, ZoomOut, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PDFViewerProps {
  documentName?: string;
  documentType?: string;
  metadata?: {
    date: string;
    fromEmail: string;
    emailSubject: string;
  };
}

const PDFViewer = ({ documentName = 'Document.pdf', documentType = 'Unknown', metadata }: PDFViewerProps) => {
  const getDocumentContent = (type: string) => {
    switch (type) {
      case 'MBL':
        return (
          <div className="bg-white border rounded-lg shadow-sm min-h-[800px] p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-900">MASTER BILL OF LADING</h2>
              <p className="text-sm text-slate-600">B/L No: MBL-12345</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">SHIPPER:</h3>
                <p className="text-sm text-slate-700">
                  ABC Manufacturing Co.<br/>
                  123 Industrial Drive<br/>
                  Shanghai, China 200000
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">CONSIGNEE:</h3>
                <p className="text-sm text-slate-700">
                  XYZ Imports LLC<br/>
                  456 Commerce Street<br/>
                  Los Angeles, CA 90210
                </p>
              </div>
            </div>

            <div className="border border-slate-300 rounded p-4 mb-4">
              <h3 className="font-semibold text-slate-900 mb-2">VESSEL & VOYAGE:</h3>
              <p className="text-sm text-slate-700">MSC MAGNIFICENT / V.234E</p>
            </div>

            <div className="border border-slate-300 rounded p-4">
              <h3 className="font-semibold text-slate-900 mb-2">CONTAINER DETAILS:</h3>
              <p className="text-sm text-slate-700">
                Container No: MSKU7654321<br/>
                Seal No: 12345678<br/>
                Size/Type: 40' HC
              </p>
            </div>
          </div>
        );
      
      case 'HBL':
        return (
          <div className="bg-white border rounded-lg shadow-sm min-h-[800px] p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-900">HOUSE BILL OF LADING</h2>
              <p className="text-sm text-slate-600">H/B/L No: HBL-54321</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">SHIPPER:</h3>
                <p className="text-sm text-slate-700">
                  DEF Trading Co.<br/>
                  789 Export Avenue<br/>
                  Guangzhou, China 510000
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">CONSIGNEE:</h3>
                <p className="text-sm text-slate-700">
                  ABC Logistics Inc.<br/>
                  321 Import Blvd<br/>
                  New York, NY 10001
                </p>
              </div>
            </div>

            <div className="border border-slate-300 rounded p-4">
              <h3 className="font-semibold text-slate-900 mb-2">CARGO DESCRIPTION:</h3>
              <p className="text-sm text-slate-700">
                Electronic Components and Parts<br/>
                Weight: 15,000 KGS<br/>
                Volume: 25 CBM
              </p>
            </div>
          </div>
        );
      
      case 'Pack List':
        return (
          <div className="bg-white border rounded-lg shadow-sm min-h-[800px] p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-900">PACKING LIST</h2>
              <p className="text-sm text-slate-600">List No: PL-98765</p>
            </div>
            
            <div className="border border-slate-300 rounded">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-900">Item</th>
                    <th className="text-left p-3 font-semibold text-slate-900">Quantity</th>
                    <th className="text-left p-3 font-semibold text-slate-900">Weight (KG)</th>
                    <th className="text-left p-3 font-semibold text-slate-900">Dimensions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200">
                    <td className="p-3 text-slate-700">Electronic Components Box 1</td>
                    <td className="p-3 text-slate-700">50 pcs</td>
                    <td className="p-3 text-slate-700">125.5</td>
                    <td className="p-3 text-slate-700">60×40×30 cm</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="p-3 text-slate-700">Electronic Components Box 2</td>
                    <td className="p-3 text-slate-700">30 pcs</td>
                    <td className="p-3 text-slate-700">75.2</td>
                    <td className="p-3 text-slate-700">50×35×25 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default: // Commercial Invoice
        return (
          <div className="bg-white border rounded-lg shadow-sm min-h-[800px] p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-900">COMMERCIAL INVOICE</h2>
              <p className="text-sm text-slate-600">Invoice #: INV001234</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">FROM:</h3>
                <p className="text-sm text-slate-700">
                  ABC Manufacturing Co.<br/>
                  123 Industrial Drive<br/>
                  Shanghai, China 200000<br/>
                  Tel: +86-21-1234-5678
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">TO:</h3>
                <p className="text-sm text-slate-700">
                  XYZ Imports LLC<br/>
                  456 Commerce Street<br/>
                  Los Angeles, CA 90210<br/>
                  Tel: +1-555-123-4567
                </p>
              </div>
            </div>

            <div className="border border-slate-300 rounded">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-900">Description</th>
                    <th className="text-left p-3 font-semibold text-slate-900">Qty</th>
                    <th className="text-left p-3 font-semibold text-slate-900">Unit Price</th>
                    <th className="text-left p-3 font-semibold text-slate-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200">
                    <td className="p-3 text-slate-700">Electronic Components - Capacitors</td>
                    <td className="p-3 text-slate-700">500 pcs</td>
                    <td className="p-3 text-slate-700">$2.50</td>
                    <td className="p-3 text-slate-700">$1,250.00</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="p-3 text-slate-700">Electronic Components - Resistors</td>
                    <td className="p-3 text-slate-700">1000 pcs</td>
                    <td className="p-3 text-slate-700">$0.75</td>
                    <td className="p-3 text-slate-700">$750.00</td>
                  </tr>
                </tbody>
              </table>
              <div className="border-t border-slate-200 p-3 bg-slate-50">
                <div className="text-right">
                  <strong className="text-slate-900">Total Amount: $2,000.00</strong>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* PDF Controls */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-slate-900">{documentName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-600">100%</span>
            <Button variant="ghost" size="sm">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Document Metadata */}
        {metadata && (
          <div className="space-y-1 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Date:</span>
              <span>{metadata.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span className="font-medium">From:</span>
              <a 
                href={`mailto:${metadata.fromEmail}?subject=${encodeURIComponent(metadata.emailSubject)}`}
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1"
              >
                <span>{metadata.emailSubject}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 p-4 overflow-auto bg-slate-50">
        <Card className="mx-auto max-w-full">
          <CardContent className="p-0">
            {getDocumentContent(documentType)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PDFViewer;
