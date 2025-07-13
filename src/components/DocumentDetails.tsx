
import { X, Edit, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PDFViewer from '@/components/PDFViewer';
import AIChatInterface from '@/components/AIChatInterface';

interface DocumentDetailsProps {
  documentId: string;
  onClose: () => void;
}

const DocumentDetails = ({ documentId, onClose }: DocumentDetailsProps) => {
  const [showAICopilot, setShowAICopilot] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Mock document data based on documentId
  const documentData = {
    id: documentId,
    name: 'Commercial Invoice_2024_001',
    type: 'CI',
    date: '2024-07-04',
    status: 'Processed',
    fileSize: '2.3 MB',
    uploadedBy: 'John Doe',
    description: 'Commercial invoice for motor vehicle shipment',
    details: {
      invoiceNumber: 'INV-2024-001',
      supplier: 'ABC Motors Ltd.',
      buyer: 'XYZ Trading Co.',
      totalAmount: '$45,000',
      currency: 'USD'
    }
  };

  const handleToggleAICopilot = () => {
    setShowAICopilot(!showAICopilot);
  };

  return (
    <div className="h-full flex bg-white">
      {/* Left Panel - Document Viewer */}
      <div className="w-1/2 border-r border-slate-200">
        <PDFViewer 
          documentName={documentData.name}
          documentType={documentData.type}
          metadata={{
            date: documentData.date,
            fromEmail: 'supplier@abcmotors.com',
            emailSubject: 'Commercial Invoice - Shipment #2024001'
          }}
        />
      </div>

      {/* Right Panel - Digital View + AI Copilot */}
      <div className="w-1/2 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Digital View</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Digital Document View */}
        <div className={`${showAICopilot ? 'h-3/5' : 'flex-1'} p-4 overflow-y-auto`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{documentData.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {documentData.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Date:</span>
                  <span className="font-medium ml-2">{documentData.date}</span>
                </div>
                <div>
                  <span className="text-slate-600">Type:</span>
                  <code className="text-sm font-mono text-green-600 bg-green-50 px-2 py-1 rounded ml-2">
                    {documentData.type}
                  </code>
                </div>
                <div>
                  <span className="text-slate-600">File Size:</span>
                  <span className="font-medium ml-2">{documentData.fileSize}</span>
                </div>
                <div>
                  <span className="text-slate-600">Uploaded by:</span>
                  <span className="font-medium ml-2">{documentData.uploadedBy}</span>
                </div>
              </div>

              <div>
                <span className="text-sm text-slate-600">Description:</span>
                <p className="text-sm text-slate-900 mt-1">{documentData.description}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Document Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Invoice Number:</span>
                    <span className="font-medium">{documentData.details.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Supplier:</span>
                    <span className="font-medium">{documentData.details.supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Buyer:</span>
                    <span className="font-medium">{documentData.details.buyer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Amount:</span>
                    <span className="font-medium">{documentData.details.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Currency:</span>
                    <span className="font-medium">{documentData.details.currency}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Copilot Show/Hide Bar */}
        <div className="border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={handleToggleAICopilot}
            className="w-full flex items-center justify-center py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            {showAICopilot ? (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Hide AI Copilot
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show AI Copilot
              </>
            )}
          </Button>
        </div>

        {/* AI Copilot Panel - Takes 2/5 of right panel when shown */}
        {showAICopilot && (
          <div className="h-2/5 border-t border-slate-200">
            <AIChatInterface
              activeTab="documents"
              setActiveTab={() => {}}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              hideQuickSuggestions={true}
              isVisible={showAICopilot}
              showTitleBar={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentDetails;
