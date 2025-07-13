
import { useState } from 'react';
import { ChevronUp, ChevronDown, X, Edit, History } from 'lucide-react';
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

const DocumentReviewList = () => {
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

  const handleEditDocument = (documentId: string) => {
    navigate('/document-review');
  };

  const documentsForReview = [
    {
      id: 'DOC-001',
      type: 'Commercial Invoice',
      date: '2024-07-01',
      confidenceScore: 0.87
    },
    {
      id: 'DOC-002',
      type: 'Bill of Lading',
      date: '2024-07-02',
      confidenceScore: 0.91
    },
    {
      id: 'DOC-003',
      type: 'Packing List',
      date: '2024-07-01',
      confidenceScore: 0.89
    }
  ];

  const getConfidenceScoreBadge = (score: number) => {
    if (score < 0.6) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Low ({Math.round(score * 100)}%)</Badge>;
    } else if (score < 0.8) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium ({Math.round(score * 100)}%)</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 border-green-200">High ({Math.round(score * 100)}%)</Badge>;
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

        {/* Right Panel - Document Review List */}
        <div className="w-1/2 border-l border-slate-200 bg-white flex flex-col">
          {/* Document Review List - Takes available space */}
          <div className="flex-1 overflow-hidden">
            <Card className="h-full rounded-none border-0 shadow-none">
              <CardHeader className="border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-slate-800">
                    Documents Requiring Review
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
                      <TableHead>Document ID</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Confidence Score</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentsForReview.map((document, index) => (
                      <TableRow key={index} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-blue-600">
                          {document.id}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {document.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {document.date}
                        </TableCell>
                        <TableCell>
                          {getConfidenceScoreBadge(document.confidenceScore)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditDocument(document.id)}
                            className="flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Toggle Button - Always at bottom */}
          <div className="flex justify-between items-center p-4 border-t border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/3e3238a5-b33b-4ed6-97f3-02922f987598.png" 
                alt="AI Assistant" 
                className="w-12 h-12 flex-shrink-0 font-black"
              />
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

export default DocumentReviewList;
