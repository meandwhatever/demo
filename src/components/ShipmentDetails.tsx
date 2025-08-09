import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, User, Settings, ChevronDown, ChevronUp, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PDFViewer from '@/components/PDFViewer';
import ShipmentDetailsPanel from '@/components/ShipmentDetailsPanel';
import AIChatInterface from '@/components/AIChatInterface';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ChatItem } from '@/pages/Index';
import ValidationFields from '@/components/ValidationFields';


/* shipment json has the following structure:
1.   "shipment_id": String,
2.     "created_at": Date,
3.     "created_by": String,
4.  "involved_party": {
5.         "shipper_name": String,
6.         "shipper_address": String,
7.         "consignee_name": String,
8.         "consignee_address": String,
9.         "orgin_agent_name": String,
10.         "orgin_agent_address": String,         
11.         "destination_agent_name": String,   
12.         "destination_agent_address": String,
13. 

1.   },
2.  "shipment": {
3.     "master_bill_of_lading_number": String,
4.     "house_bill_of_lading_number": String,
5.     "vessel_name": String,
6.     "voyage_number": String,
7.     "port_of_loading": String,
8.     "port_of_discharge": String,
9.     "place_of_receipt": String,       
10.     "place_of_delivery": String,
11.     "freight_mode": string,
12.  "total_number_of_containers": number,
13.     "total_weight": number,
14.     "total_volumn": number,
15.     "total_package": number
16.   },
17. "containers": [
18.     {
19.       "container_number": string,
20.       "seal_number": string,
21.       "container_type": string,
22.       "number_of_packages": number,
23.       "package_uom": string,
24.       "weight": number,
25.       "weight_uom": string,
26.       "volume": number,
27.       "volume_uom": string,
28.       "product_item_description": string,
29.       "product_item_hscode": string
30.     }
*/


interface ShipmentDetailsProps {
  shipmentId: string;
  onClose: () => void;
  chatHistory: ChatItem[];
  setChatHistory: (chatHistory: ChatItem[]) => void;
}
/*
model Shipment {
  /// Internal UUID primary key
  id             String   @id @default(utoincrement())
  /// Your “ocn-xxxxxx” business identifier
  shipmentId     String   @unique
  /// FCL, LCL, AIR, etc.
  mode           String?
  mbl_Number     String?
  mbl_url        String?
  hbl_Number     String?  @unique
  hbl_url        String?  @unique
  created_at     DateTime @default(now())
  created_by     String?
  updated_at     DateTime @updatedAt
  updated_by     String?
  updated_reason String?
  /// All containers on this shipment
  containers     Json[]
  /// All freight-charge line items
  freightCharges Json[]
  /// holds involved_party,shipment,containers,freight_charges,customs,shipping_documents,validation_result
  /// dont worry for now
  rawJson        Json?
}
*/

export interface Shipment {
  id: number;
  shipmentId: string;
  mode: string | null;
  mbl_Number: string | null;
  mbl_url: string | null;
  hbl_Number: string | null;
  hbl_url: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  updated_reason: string | null;
  containers: any[] | null;
  freightCharges: any[] | null;
  rawJson: any | null;
  mblRawJson: any | null;
  hblRawJson: any | null;
}

const ShipmentDetails = ({ shipmentId,  onClose, chatHistory, setChatHistory }: ShipmentDetailsProps) => {
  const [chatMessage, setChatMessage] = useState('');
  const [activeDocument, setActiveDocument] = useState('MBL');
  const [isAIVisible, setIsAIVisible] = useState(false);
  const navigate = useNavigate();




  const getDocumentMetadata = (type: string) => {
    const baseMetadata = {
      date: '2024-03-15',
      fromEmail: 'supplier@abcmanufacturing.com',
      emailSubject: type === 'MBL' ? 'Master Bill of Lading - Shipment #MBL-12345' : 
                   type === 'HBL' ? 'House Bill of Lading - Shipment #HBL-54321' :
                   'Commercial Invoice - Order #INV001234'
    };
    return baseMetadata;
  };

  const [shipmentData, setShipmentData] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);


  const fetchShipment = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/get/get_shipment_details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipmentId }),
      });
      if (!res.ok) throw new Error('error when fetching shipment details');
      const data: Shipment = await res.json();
      setShipmentData(data);
    } catch (err) {
      console.error('Failed to load shipment', err);
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);
  
  useEffect(() => {
    fetchShipment();
  }, [fetchShipment]);

  const documents = [
    { id: 'MBL', name: 'MBL_12345.pdf', type: 'MBL', url: shipmentData?.mbl_url },
    { id: 'HBL', name: 'HBL_54321.pdf', type: 'HBL', url: shipmentData?.hbl_url },
    { id: 'CI', name: 'Commercial_Invoice_001.pdf', type: 'Commercial Invoice', url: null}//not implemented yet
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="flex items-center space-x-1 text-slate-600 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </div>
          

        </div>
      </nav>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - PDF Viewer with Tabs */}
        <div className="w-1/2 border-r border-slate-200 bg-white flex flex-col">
          <Tabs value={activeDocument} onValueChange={setActiveDocument} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
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
                  documentUrl={doc.url}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Right Panel - Shipment Details and AI Chat */}
        <div className="w-1/2 bg-white flex flex-col">
        <div className={`${isAIVisible ? 'flex-[3]' : 'flex-1'} border-b border-slate-200 overflow-hidden`}>
            {loading || !shipmentData ? (
              <div className="p-6 text-sm text-slate-600">Loading…</div>
            ) : shipmentData.rawJson ? (
              <ShipmentDetailsPanel shipment={shipmentData} />
            ) : (
              <ValidationFields
                shipmentData={shipmentData}
                onBuilt={fetchShipment}  // when child finishes building, refresh to show details panel
              />
            )}
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
                activeTab="shipment"
                setActiveTab={() => {}}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                hideQuickSuggestions={true}
                isVisible={isAIVisible}
                onToggle={() => setIsAIVisible(!isAIVisible)}
                showTitleBar={false}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
