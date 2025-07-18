
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

const Index = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [showClassificationDetails, setShowClassificationDetails] = useState(false);
  const [classificationDetailsTitle, setClassificationDetailsTitle] = useState('');
  const [showClassificationDetailsPage, setShowClassificationDetailsPage] = useState(false);
  const [selectedHsCode, setSelectedHsCode] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);

  //for document details
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState<'mbl' | 'hbl'>('mbl');
  
  const [showReviewList, setShowReviewList] = useState(false);
  const [isAIChatVisible, setIsAIChatVisible] = useState(true);

  const handleShowClassificationDetails = (title: string) => {
    setClassificationDetailsTitle(title);
    setShowClassificationDetails(true);
    setShowDocumentDetails(false);
    setShowReviewList(false);
  };

  const handleViewClassificationDetails = (hsCode: string) => {
    setSelectedHsCode(hsCode);
    setShowClassificationDetailsPage(true);
    setShowClassificationDetails(false);
    setShowDocumentDetails(false);
    setShowReviewList(false);
  };

  const handleViewDocumentDetails = (documentId: string, documentType: 'mbl' | 'hbl') => {
    setSelectedDocumentId(documentId);
    setSelectedDocumentType(documentType);
    setShowDocumentDetails(true);
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

  const handleShowReviewList = () => {
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
              <RecentClassifications onViewDetails={handleViewClassificationDetails} />
              <RecentDocuments onViewDocumentDetails={handleViewDocumentDetails} />
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
                  />
                </div>
              )}
              
              {/* Classification Details Page - Takes full right panel when shown and file upload/review list is not shown */}
              {showClassificationDetailsPage && !showFileUpload && !showReviewList && (
                <div className="h-full">
                  <ClassificationDetailsPage 
                    hsCode={selectedHsCode}
                    onClose={() => setShowClassificationDetailsPage(false)}
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
                    activeTab="classification"
                    setActiveTab={() => {}}
                    chatMessage={chatMessage}
                    setChatMessage={setChatMessage}
                    onUploadClick={handleShowFileUpload}
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
