//shown when user clicks on a classification in the recent classifications list
import { useState } from 'react';
import { X, Download, FileText, ChevronUp, ChevronDown, Sparkles, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AIChatInterface from './AIChatInterface';

interface ClassificationDetailsPageProps {
  hsCode: string;
  id: string;
  confidence: number;
  date: string;
  product: string;
  description: string;
  onClose: () => void;
}

const ClassificationDetailsPage = ({ hsCode, id, confidence, date, product, description, onClose }: ClassificationDetailsPageProps) => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Mock data - in a real app, this would come from props or API
  const classificationData = {
    '8703': {
      date: date,
      productTitle: product,
      productDescription: description,
      hsCode: hsCode,
      dutyRate: '2.5%',
      confidence: confidence,
      justification: {
        productSummary: 'to be added',
        stepByStepAnalysis: [
          'to be added',
        ],
        reference: 'to be added'
      }
    }
  };

  const data = classificationData[8703];

  if (!data) {
    return (
      <div className="h-full bg-white flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Classification Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-slate-500">Classification details not found.</p>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    // In a real application, this would generate and download a PDF
    console.log('Downloading PDF for HS Code:', hsCode);
    alert('PDF download functionality would be implemented here');
  };

  return (
    <div className="h-full bg-white flex flex-col relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-900">Classification Details</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Container */}
      {/* Scrollable content (everything below the header) */}
        <div className={`flex-1 overflow-y-auto p-6 ${showAIChat ? 'mb-[40%]' : ''}`}>
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Product Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Date</label>
                      <p className="text-sm text-slate-900">{data.date}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">HS Code</label>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {data.hsCode}
                        </code>
                        <Badge variant="outline" className="text-xs">
                          {confidence}% Confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Product Title</label>
                    <p className="text-sm text-slate-900 mt-1">{data.productTitle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Product Description</label>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{data.productDescription}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Duty Rate</label>
                    <p className="text-sm font-semibold text-green-600 mt-1">{data.dutyRate}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Justification */}
              <Card>
                <CardHeader>
                  <CardTitle>Classification Justification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Product Summary</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{data.justification.productSummary}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Step-by-Step Analysis</h4>
                    <div className="space-y-3">
                      {data.justification.stepByStepAnalysis.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Reference</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{data.justification.reference}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>


        {/* AI Chat Interface - Positioned at bottom 2/5 when shown */}
        {showAIChat && (
          <div className="absolute bottom-0 left-0 right-0 h-2/5 border-t border-slate-200 bg-white">
            <div className="h-full flex flex-col">
              {/* AI Copilot Header Bar */}
              <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-purple-700">AI Copilot</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAIChat(!showAIChat)}
                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 hover:bg-purple-100 font-bold"
                  >
                    <ChevronDown className="w-4 h-4" />
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
              
              {/* AI Chat Content */}
              <div className="flex-1">
                <AIChatInterface 
                  activeTab="classification"
                  setActiveTab={() => {}}
                  chatMessage={chatMessage}
                  setChatMessage={setChatMessage}
                  hideQuickSuggestions={true}
                  showTitleBar={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* AI Copilot Toggle Button - Fixed at bottom when hidden */}
        {!showAIChat && (
          <div className=" bottom-0 left-0 right-0 flex justify-between items-center p-4 border-t border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-purple-700">AI Copilot</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIChat(!showAIChat)}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 hover:bg-purple-100 font-bold"
              >
                <ChevronUp className="w-4 h-4" />
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
        )}

    </div>
  );
};

export default ClassificationDetailsPage;
