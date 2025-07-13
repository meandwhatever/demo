
import { useState } from 'react';
import { Sparkles, ChevronUp, ChevronDown, X, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navigation from '@/components/Navigation';
import AIChatInterface from '@/components/AIChatInterface';
import RecentDocuments from '@/components/RecentDocuments';
import Shipments from '@/components/Shipments';
import AlertsAndActions from '@/components/AlertsAndActions';
import { useNavigate } from 'react-router-dom';

const DocumentList = () => {
  const navigate = useNavigate();
  const [showAI, setShowAI] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [showClassificationDetails, setShowClassificationDetails] = useState(false);

  const handleShowClassificationDetails = (title: string) => {
    setShowClassificationDetails(true);
  };

  const handleShowReviewList = () => {
    // Empty handler since this page doesn't use the review list functionality
  };

  const handleClose = () => {
    navigate('/');
  };

  const documents = [
    {
      name: 'MBL_12345.pdf',
      type: 'MBL',
      status: 'processed',
      shipmentId: 'SH-001',
      processingDate: '2024-07-01'
    },
    {
      name: 'CommercialInvoice_67890.pdf',
      type: 'Commercial Invoice',
      status: 'in_processing',
      shipmentId: 'SH-002',
      processingDate: '2024-07-02'
    },
    {
      name: 'HBL_54321.pdf',
      type: 'HBL',
      status: 'attention_required',
      shipmentId: 'SH-001',
      processingDate: '2024-07-01'
    },
    {
      name: 'PackingList_98765.pdf',
      type: 'Pack List',
      status: 'processed',
      shipmentId: 'SH-003',
      processingDate: '2024-07-03'
    },
    {
      name: 'BillOfLading_11111.pdf',
      type: 'Bill of Lading',
      status: 'in_processing',
      shipmentId: 'SH-004',
      processingDate: '2024-07-02'
    },
    {
      name: 'CertificateOfOrigin_22222.pdf',
      type: 'Certificate of Origin',
      status: 'processed',
      shipmentId: 'SH-002',
      processingDate: '2024-07-01'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Processed</Badge>;
      case 'in_processing':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Processing</Badge>;
      case 'attention_required':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Attention Required</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Same as parent page */}
        <div className="w-1/2 p-6 overflow-y-auto bg-slate-50">
          <AlertsAndActions 
            onShowDetails={handleShowClassificationDetails}
            onShowReviewList={handleShowReviewList}
          />
          <RecentDocuments />
          <Shipments />
        </div>

        {/* Right Panel - Document List */}
        <div className="w-1/2 border-l border-slate-200 bg-white flex flex-col">
          {/* Document List - Takes most of the space */}
          <div className={showAI ? "h-3/5 overflow-hidden" : "flex-1 overflow-hidden"}>
            <Card className="h-full rounded-none border-0 shadow-none">
              <CardHeader className="border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-slate-800">
                    All Documents
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="p-1 h-8 w-8 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-full overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Processing Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((document, index) => (
                      <TableRow key={index} className="hover:bg-slate-50">
                        <TableCell className="font-medium">
                          {document.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {document.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(document.status)}
                        </TableCell>
                        <TableCell className="text-blue-600 font-medium">
                          {document.shipmentId}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {document.processingDate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Toggle Button - Dashboard style */}
          <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-purple-700">AI Assistant</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAI(!showAI)}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 hover:bg-purple-100 font-bold"
              >
                {showAI ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <History className="w-4 h-4" />
              <span className="text-sm">History</span>
            </Button>
          </div>

          {/* AI Chat Interface - Shows when toggled */}
          {showAI && (
            <div className="h-2/5 border-t border-slate-200">
              <AIChatInterface 
                activeTab="documents"
                setActiveTab={() => {}}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                hideQuickSuggestions={true}
                isVisible={showAI}
                onToggle={() => setShowAI(!showAI)}
                showTitleBar={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
