
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import RecentClassifications from '@/components/RecentClassifications';
import RecentDocuments from '@/components/RecentDocuments';
import AlertsAndActions from '@/components/AlertsAndActions';
import AIChatInterface from '@/components/AIChatInterface';
import ClassificationDetails from '@/components/ClassificationDetails';
import ClassificationDetailsPage from '@/components/ClassificationDetailsPage';
import DocumentDetails from '@/components/DocumentDetails';
import FileUpload from '@/components/FileUpload';
import ReviewList from '@/components/ReviewList';
import AIChatToggle from '@/components/AIChatToggle';
import RecentShipments from '@/components/RecentShipments';
import ShipmentDetails from '@/components/ShipmentDetails';

export type ChatItem = {
    message: string;
    time: string;
    from: 'user' | 'ai';
    /** true only for the temporary “Processing…” bubble */
    isPlaceholder?: boolean;
  };

const Index = () => {
    // Conversation state managed locally then persisted remotely if needed
    const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);







  const [chatMessage, setChatMessage] = useState('');
  const [showClassificationDetails, setShowClassificationDetails] = useState(false);
  const [classificationDetailsTitle, setClassificationDetailsTitle] = useState('');
  const [showClassificationDetailsPage, setShowClassificationDetailsPage] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);

  //for document details
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState<'mbl' | 'hbl'>('mbl');
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('');


  
  //for classification details
  const [selectedHsCode, setSelectedHsCode] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [selectedConfidence, setSelectedConfidence] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');



  const [showReviewList, setShowReviewList] = useState(false);
  const [isAIChatVisible, setIsAIChatVisible] = useState(true);

  //for realtime data saving and updating
  const [dbBump, setDbBump] = useState(0);




//functions for showing and hiding panels
//functions will be passed to child components as props, which will be called and set the state of the parent component
//which the useState will then be passed to the child component as props
  const handleShowClassificationDetails = (title: string) => {
    setClassificationDetailsTitle(title);
    setShowClassificationDetails(true);
    setShowDocumentDetails(false);
    setShowReviewList(false);
  };

  const handleViewClassificationDetails = (hsCode: string, id: string, confidence: number, date: string, product: string, description: string) => {
    setSelectedHsCode(hsCode);
    setSelectedId(id);
    setSelectedConfidence(confidence);
    setSelectedDate(date);
    setSelectedProduct(product);
    setSelectedDescription(description);
    setShowClassificationDetailsPage(true);
    setShowClassificationDetails(false);
    setShowDocumentDetails(false);
    setShowReviewList(false);
  };

  const handleViewDocumentDetails = (documentId: string, documentType: 'mbl' | 'hbl', documentUrl: string) => {
    setSelectedDocumentId(documentId);
    setSelectedDocumentType(documentType);
    setSelectedDocumentUrl(documentUrl);
    setShowDocumentDetails(true);
    setShowClassificationDetails(false);
    setShowClassificationDetailsPage(false);
    setShowReviewList(false);
  };

  //for shipment details
  const [selectedShipmentId, setSelectedShipmentId] = useState('');
  const [selectedShipmentType, setSelectedShipmentType] = useState('');
  const [showShipmentDetails, setShowShipmentDetails] = useState(false);

  const handleViewShipmentDetails = (shipmentId: string, mode: string) => {
    setSelectedShipmentId(shipmentId);
    setSelectedShipmentType(mode);
    setShowShipmentDetails(true);
    setShowClassificationDetails(false);
    setShowClassificationDetailsPage(false);
    setShowReviewList(false);
  };

  const handleShowFileUpload = () => {
    setShowFileUpload(true);
  };

  const handleCloseFileUpload = () => {
    setShowFileUpload(false);
  };

  const handleShowReviewList = (id: string, hsCode: string, confidence: number, createdAt: string, product: string, description: string) => {
    setSelectedId(id);
    setSelectedHsCode(hsCode);
    setSelectedConfidence(confidence);
    setSelectedDate(createdAt);
    setSelectedProduct(product);
    setSelectedDescription(description);
    setShowReviewList(true);
    setShowClassificationDetails(false);
    setShowClassificationDetailsPage(false);
    setShowDocumentDetails(false);
  };

  const handleCloseReviewList = () => {
    setShowReviewList(false);
  };

  const handleToggleAIChat = () => {
    setIsAIChatVisible(!isAIChatVisible);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Document Details - Takes full screen when shown */}
        {showDocumentDetails ? (
          <div className="w-full">
            <DocumentDetails 
              documentId={selectedDocumentId}
              documentType={selectedDocumentType}
              onClose={() => setShowDocumentDetails(false)}
              documentUrl={selectedDocumentUrl}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              
            />
          </div>
        ) : showShipmentDetails ? (
          <div className="w-full">
            <ShipmentDetails 
            shipmentId={selectedShipmentId}
            mode={selectedShipmentType}
            onClose={() => setShowShipmentDetails(false)}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          
            />
          </div>
        ) : (
          <>
            {/* Left Panel - Dashboard & Tools */}
            <div className="w-1/2 p-6 overflow-y-auto bg-slate-50">
              <AlertsAndActions 
                onShowDetails={handleShowClassificationDetails}
                onShowReviewList={handleShowReviewList}
              />
              <RecentClassifications onViewDetails={handleViewClassificationDetails} dbBump={dbBump} onDataSaved={() => setDbBump(prev => prev + 1)} />
              <RecentDocuments onViewDocumentDetails={handleViewDocumentDetails} dbBump={dbBump} onDataSaved={() => setDbBump(prev => prev + 1)} />
              <RecentShipments onViewShipmentDetails={handleViewShipmentDetails} dbBump={dbBump} onDataSaved={() => setDbBump(prev => prev + 1)} />
            </div>

            {/* Right Panel - Classification Details & AI Interface */}
            <div className="w-1/2 border-l border-slate-200 bg-white flex flex-col">
              {/* File Upload - Takes 2/5 of right panel when shown */}
              {showFileUpload && (
                <div className="h-2/5 border-b border-slate-200">
                  <FileUpload onClose={handleCloseFileUpload} />
                </div>
              )}
              
              {/* Review List - Takes 3/5 of right panel when shown */}
              {showReviewList && !showFileUpload && (
                <div className="h-3/5 border-b border-slate-200">
                  <ReviewList 
                    onClose={handleCloseReviewList}
                    onViewDetails={handleViewClassificationDetails}
                    id={selectedId}
                    confidence={selectedConfidence}
                    date={selectedDate}
                    product={selectedProduct}
                    description={selectedDescription}
                    hsCode={selectedHsCode}
                  />
                </div>
              )}
              
              {/* Classification Details Page - Takes full right panel when shown and file upload/review list is not shown */}
              {showClassificationDetailsPage && !showFileUpload && !showReviewList && (
                <div className="h-full">
                  <ClassificationDetailsPage 
                    id={selectedId}
                    confidence={selectedConfidence}
                    date={selectedDate}
                    product={selectedProduct}
                    description={selectedDescription}
                    hsCode={selectedHsCode}
                    onClose={() => setShowClassificationDetailsPage(false)}
                    chatHistory={chatHistory}
                    setChatHistory={setChatHistory}
                  />
                </div>
              )}
              
              {/* Original Classification Details - Takes 3/5 of right panel when shown and details page/review list is not shown */}
              {!showClassificationDetailsPage && !showReviewList && showClassificationDetails && !showFileUpload && (
                <div className="h-3/5 border-b border-slate-200">
                  <ClassificationDetails 
                    title={classificationDetailsTitle}
                    onClose={() => setShowClassificationDetails(false)}
                  />
                </div>
              )}
              
              {/* AI Chat Toggle Bar */}
              {(showReviewList || showClassificationDetails || showFileUpload) && !showClassificationDetailsPage && (
                <AIChatToggle 
                  isVisible={isAIChatVisible}
                  onToggle={handleToggleAIChat}
                />
              )}
              
              {/* AI Chat Interface - Takes remaining space or hidden */}
              {isAIChatVisible && (
                <div className={
                  showFileUpload 
                    ? "h-3/5" 
                    : (showClassificationDetailsPage
                        ? "hidden" 
                        : (showClassificationDetails || showReviewList ? "h-2/5" : "h-full"))
                }>
                  <AIChatInterface 
                    chatHistory={chatHistory}
                    setChatHistory={setChatHistory}
                    activeTab="classification"
                    setActiveTab={() => {}}
                    chatMessage={chatMessage}
                    setChatMessage={setChatMessage}
                    onUploadClick={handleShowFileUpload}
                    onDataSaved={() =>
                      setDbBump(prev => {
                        const next = prev + 1;
                        console.log('🔄 dbBump incremented for AIChatInterface →', next);
                        return next;
                      })
                    }
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
