
import { useState } from 'react';
import { ArrowLeft, User, Settings, ChevronDown, ChevronUp, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PDFViewer from '@/components/PDFViewer';
import DeclarationFormDetails from '@/components/DeclarationFormDetails';
import AIChatInterface from '@/components/AIChatInterface';
import { useNavigate } from 'react-router-dom';

const ApprovalSubmit = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [activeDocument, setActiveDocument] = useState('CI');
  const [isAIVisible, setIsAIVisible] = useState(false);
  const navigate = useNavigate();

  const documents = [
    { id: 'CI', name: 'Commercial_Invoice_001.pdf', type: 'Commercial Invoice' },
    { id: 'PL', name: 'Packing_List_001.pdf', type: 'Pack List' }
  ];

  const getDocumentMetadata = (type: string) => {
    const baseMetadata = {
      date: '2024-03-15',
      fromEmail: 'supplier@abcmanufacturing.com',
      emailSubject: type === 'Commercial Invoice' ? 'Commercial Invoice - Order #INV001234' : 
                   'Packing List - Order #PL001234'
    };
    return baseMetadata;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-slate-800">Your Company Logo</h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/approval-submit-list')}
              className="flex items-center space-x-1 text-slate-600 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              AI Active
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5 text-slate-600" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - PDF Viewer with Tabs for Documents */}
        <div className="w-1/2 border-r border-slate-200 bg-white flex flex-col">
          <Tabs value={activeDocument} onValueChange={setActiveDocument} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
              {documents.map((doc) => (
                <TabsTrigger key={doc.id} value={doc.id} className="flex items-center space-x-2">
                  <span>{doc.type}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {documents.map((doc) => (
              <TabsContent key={doc.id} value={doc.id} className="flex-1 mt-0">
                <PDFViewer 
                  documentName={doc.name}
                  documentType={doc.type}
                  metadata={getDocumentMetadata(doc.type)}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Right Panel - Declaration Form and AI Chat */}
        <div className="w-1/2 bg-white flex flex-col">
          <div className={`${isAIVisible ? 'flex-[3]' : 'flex-1'} border-b border-slate-200 overflow-hidden`}>
            <DeclarationFormDetails />
          </div>
          
          {/* AI Assistant Toggle Button - Dashboard style */}
          <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/3e3238a5-b33b-4ed6-97f3-02922f987598.png" 
                alt="AI Assistant" 
                className="w-8 h-8 flex-shrink-0"
              />
              <span className="text-sm font-bold text-purple-700">AI Assistant</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAIVisible(!isAIVisible)}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 hover:bg-purple-100 font-bold"
              >
                {isAIVisible ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
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
          
          {/* AI Chat Interface - Collapsible */}
          {isAIVisible && (
            <div className="flex-[2]">
              <AIChatInterface 
                activeTab="forms"
                setActiveTab={() => {}}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                hideQuickSuggestions={true}
                isVisible={isAIVisible}
                onToggle={() => setIsAIVisible(!isAIVisible)}
                showTitleBar={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalSubmit;
