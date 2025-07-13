
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

const ShipmentList = () => {
  const navigate = useNavigate();
  const [showAI, setShowAI] = useState(true); // Default to true
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

  const handleShipmentClick = (shipmentId: string) => {
    navigate('/shipment-details');
  };

  const shipments = [
    {
      id: 'SHP-001',
      status: 'In Transit',
      statusColor: 'bg-blue-500',
      mode: 'FCL',
      shipper: 'ABC Corp Ltd',
      consignee: 'XYZ Trading Co',
      pol: 'Shanghai, China',
      pod: 'Los Angeles, USA',
      eod: '2024-06-15',
      eoa: '2024-07-10',
      documents: 'MBL, HBL, CI'
    },
    {
      id: 'SHP-002',
      status: 'Delivered',
      statusColor: 'bg-green-500',
      mode: 'LCL',
      shipper: 'Global Exports Inc',
      consignee: 'Import Solutions LLC',
      pol: 'Hamburg, Germany',
      pod: 'New York, USA',
      eod: '2024-06-20',
      eoa: '2024-07-05',
      documents: 'MBL, CI, PL'
    },
    {
      id: 'SHP-003',
      status: 'Pending',
      statusColor: 'bg-yellow-500',
      mode: 'FCL',
      shipper: 'Manufacturing Co',
      consignee: 'Retail Chain Inc',
      pol: 'Busan, South Korea',
      pod: 'Long Beach, USA',
      eod: '2024-07-01',
      eoa: '2024-07-25',
      documents: 'MBL, HBL, CI, CO'
    },
    {
      id: 'SHP-004',
      status: 'Delayed',
      statusColor: 'bg-red-500',
      mode: 'LCL',
      shipper: 'Tech Components Ltd',
      consignee: 'Electronics Dist Co',
      pol: 'Ningbo, China',
      pod: 'Seattle, USA',
      eod: '2024-06-25',
      eoa: '2024-07-15',
      documents: 'MBL, CI'
    },
    {
      id: 'SHP-005',
      status: 'In Transit',
      statusColor: 'bg-blue-500',
      mode: 'FCL',
      shipper: 'Fashion House Inc',
      consignee: 'Style Retailers',
      pol: 'Rotterdam, Netherlands',
      pod: 'Miami, USA',
      eod: '2024-07-05',
      eoa: '2024-07-20',
      documents: 'MBL, HBL, CI, PL'
    },
    {
      id: 'SHP-006',
      status: 'Processing',
      statusColor: 'bg-purple-500',
      mode: 'LCL',
      shipper: 'Food Suppliers Co',
      consignee: 'Grocery Chain Ltd',
      pol: 'Valencia, Spain',
      pod: 'Houston, USA',
      eod: '2024-07-10',
      eoa: '2024-08-02',
      documents: 'MBL, CI, CO, HC'
    }
  ];

  const getStatusBadge = (status: string, statusColor: string) => {
    const colorMap: { [key: string]: string } = {
      'bg-blue-500': 'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-500': 'bg-green-100 text-green-800 border-green-200',
      'bg-yellow-500': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-red-500': 'bg-red-100 text-red-800 border-red-200',
      'bg-purple-500': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return (
      <Badge className={colorMap[statusColor] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {status}
      </Badge>
    );
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

        {/* Right Panel - Shipment List */}
        <div className="w-1/2 border-l border-slate-200 bg-white flex flex-col">
          {/* Shipment List - Takes most of the space */}
          <div className={showAI ? "h-3/5 overflow-hidden" : "flex-1 overflow-hidden"}>
            <Card className="h-full rounded-none border-0 shadow-none">
              <CardHeader className="border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-slate-800">
                    All Shipments
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
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Shipper</TableHead>
                      <TableHead>Consignee</TableHead>
                      <TableHead>POL</TableHead>
                      <TableHead>POD</TableHead>
                      <TableHead>EOD</TableHead>
                      <TableHead>EOA</TableHead>
                      <TableHead>Documents</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.map((shipment, index) => (
                      <TableRow key={index} className="hover:bg-slate-50">
                        <TableCell className="font-medium">
                          <button
                            onClick={() => handleShipmentClick(shipment.id)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {shipment.id}
                          </button>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(shipment.status, shipment.statusColor)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {shipment.mode}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-900">
                          {shipment.shipper}
                        </TableCell>
                        <TableCell className="text-slate-900">
                          {shipment.consignee}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {shipment.pol}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {shipment.pod}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {shipment.eod}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {shipment.eoa}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {shipment.documents}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* AI Copilot Toggle Button - Dashboard style */}
          <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-purple-700">AI Copilot</span>
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
                activeTab="shipments"
                setActiveTab={() => {}}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                hideQuickSuggestions={true}
                showTitleBar={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentList;
