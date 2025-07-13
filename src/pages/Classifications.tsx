
import { useState } from 'react';
import { Search, MessageSquare, Code, Clock, AlertTriangle, Send, FileImage, History, User, Settings, ChevronDown, Upload, FileText, Truck, List, Edit, ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import AIChatInterface from '@/components/AIChatInterface';
import ClassificationDetailsPage from '@/components/ClassificationDetailsPage';
import PDFViewer from '@/components/PDFViewer';

const Classifications = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [activeTab, setActiveTab] = useState('classification');
  const [showClassificationDetails, setShowClassificationDetails] = useState(false);
  const [selectedHsCode, setSelectedHsCode] = useState('');
  
  const classifications = [
    { 
      sku: 'LEV-001-M-32x30', 
      picture: '/placeholder.svg', 
      description: '511™ Slim Jeans - Medium Wash', 
      hsCode: '6203.42.40', 
      confidence: 95, 
      reasoning: 'Cotton denim trousers for men, classified under textile garments'
    },
    { 
      sku: 'LEV-002-F-28x30', 
      picture: '/placeholder.svg', 
      description: '721™ High Rise Skinny Jeans - Dark Blue', 
      hsCode: '6204.62.40', 
      confidence: 92, 
      reasoning: 'Women\'s cotton denim trousers, high-rise style'
    },
    { 
      sku: 'LEV-003-M-L', 
      picture: '/placeholder.svg', 
      description: 'Classic Trucker Jacket - Light Wash', 
      hsCode: '6203.32.50', 
      confidence: 88, 
      reasoning: 'Men\'s cotton denim jacket, casual wear category'
    },
    { 
      sku: 'LEV-004-F-S', 
      picture: '/placeholder.svg', 
      description: 'Vintage Graphic T-Shirt - White', 
      hsCode: '6109.10.00', 
      confidence: 98, 
      reasoning: 'Cotton t-shirt with printed graphics, classified as knitted garment'
    },
    { 
      sku: 'LEV-005-M-42', 
      picture: '/placeholder.svg', 
      description: 'Leather Belt - Brown', 
      hsCode: '4203.30.00', 
      confidence: 85, 
      reasoning: 'Leather belt accessory for clothing, personal accessories category'
    },
  ];

  const chatHistory = [
    { message: 'Help me classify container shipment goods', time: '2 hours ago' },
    { message: 'What are the documentation requirements for electronics?', time: 'Yesterday' },
    { message: 'Check status of shipment SHP-12345', time: '2 days ago' },
  ];

  const suggestions = [
    'Help me classify freight items',
    'What documents are needed for customs?',
    'Check shipment tracking status',
    'Explain HS code requirements',
  ];

  const handleReviewClick = (hsCode: string) => {
    setSelectedHsCode(hsCode);
    setShowClassificationDetails(true);
  };

  const handleCloseClassificationDetails = () => {
    setShowClassificationDetails(false);
    setSelectedHsCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Left Side with Back Button and Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Back</span>
              </Button>
            </Link>
            <div className="text-2xl font-bold text-blue-600">FreightFlow®</div>
          </div>
          
          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              AI Active
            </Badge>
            
            {/* User Profile Dropdown */}
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
            
            {/* Settings Icon */}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5 text-slate-600" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Classifications Table or Document Viewer */}
        <div className="w-2/3 overflow-y-auto bg-slate-50">
          {showClassificationDetails ? (
            <PDFViewer 
              documentName="Commercial Invoice_2024_001"
              documentType="CI"
              metadata={{
                date: '2024-07-04',
                fromEmail: 'supplier@abcmotors.com',
                emailSubject: 'Commercial Invoice - Motor Vehicle Shipment'
              }}
            />
          ) : (
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    <span>All Classifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Picture</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>HS Code</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Reasoning</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classifications.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell>
                            <img 
                              src={item.picture} 
                              alt={item.description}
                              className="w-12 h-12 object-cover rounded border"
                            />
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={item.description}>
                              {item.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {item.hsCode}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {item.confidence}%
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate text-sm text-slate-600" title={item.reasoning}>
                              {item.reasoning}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleReviewClick(item.hsCode)}
                              className="flex items-center space-x-1"
                            >
                              <Eye className="w-4 h-4 text-slate-600" />
                              <span className="text-xs">Review</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Right Panel - Classification Details or AI Interface */}
        <div className="w-1/3 border-l border-slate-200 bg-white flex flex-col">
          {showClassificationDetails ? (
            <ClassificationDetailsPage 
              hsCode={selectedHsCode}
              onClose={handleCloseClassificationDetails}
            />
          ) : (
            <>
              {/* AI Engine Tabs */}
              <div className="border-b border-slate-100">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-12 bg-slate-50">
                    <TabsTrigger value="classification" className="flex items-center space-x-2">
                      <Code className="w-4 h-4" />
                      <span className="hidden sm:inline">HS Code Classification</span>
                      <span className="sm:hidden">Classification</span>
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Document Processing</span>
                      <span className="sm:hidden">Documents</span>
                    </TabsTrigger>
                    <TabsTrigger value="tracking" className="flex items-center space-x-2">
                      <Truck className="w-4 h-4" />
                      <span className="hidden sm:inline">Shipment Tracking</span>
                      <span className="sm:hidden">Tracking</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {/* Chat Messages Area */}
              <div className="h-2/3 p-6 overflow-y-auto border-b border-slate-100">
                <div className="space-y-4">
                  {/* AI Welcome Message */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 max-w-md">
                      <p className="text-sm text-slate-700">
                        Hello! I'm your {activeTab === 'classification' ? 'Freight Classification' : activeTab === 'documents' ? 'Document Processing' : 'Shipment Tracking'} AI assistant. 
                        How can I help you with your freight forwarding needs today?
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Suggestions */}
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 px-2">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setChatMessage(suggestion)}
                          className="text-xs bg-white border border-slate-200 rounded-full px-3 py-1 hover:bg-slate-50 hover:border-blue-200 transition-colors text-slate-600"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input and Tools */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex space-x-2 mb-4">
                  <textarea
                    placeholder={`Ask about ${activeTab === 'classification' ? 'freight classification and HS codes' : activeTab === 'documents' ? 'shipping document processing' : 'shipment tracking and logistics'}...`}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    rows={2}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && console.log('Send message:', chatMessage)}
                  />
                  <Button 
                    onClick={() => console.log('Send message:', chatMessage)}
                    className="bg-blue-600 hover:bg-blue-700 self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Action Icons */}
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-600">Upload File/Image</span>
                  </Button>
                </div>
              </div>
              
              {/* Chat History */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <History className="w-5 h-5 text-slate-600" />
                    <h3 className="text-sm font-medium text-slate-900">Chat History</h3>
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <List className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-600">All</span>
                  </Button>
                </div>
                <div className="space-y-3">
                  {chatHistory.map((item, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <p className="text-sm text-slate-700 mb-1">{item.message}</p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classifications;
