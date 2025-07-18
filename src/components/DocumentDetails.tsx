import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PDFViewer from "@/components/PDFViewer";
import DocumentFields from "@/components/DocumentFields";
import AIChatInterface from "@/components/AIChatInterface";

interface DocumentDetailsProps {
  /**
   * Primary‑key ID of the document that was clicked in RecentDocuments.
   */
  documentId: string;
  /**
   * Type of the document that was clicked in RecentDocuments.
   */
  documentType: 'mbl' | 'hbl';
  /**
   * Called when the user presses the Back button; parent should hide this panel.
   */
  onClose: () => void;
}

/**
 * A full‑screen replacement panel that shows a single document side‑by‑side
 * with extracted fields and an optional AI assistant.
 *
 * Styling and layout are copied from the previous `DocumentReview` mock‑up
 * (except for the top navigation bar, which lives in the parent layout).
 */
const DocumentDetails: React.FC<DocumentDetailsProps> = ({ documentId, documentType, onClose }) => {
  // ────────────────────────────────────────────────────────────────────────────
  // Local state
  // ────────────────────────────────────────────────────────────────────────────
  const [chatMessage, setChatMessage] = useState("");
  const [isAIVisible, setIsAIVisible] = useState(false);

  // Document payload fetched from the backend (very thin placeholder)
  const [documentData, setDocumentData] = useState<{
    name: string;
    type: string;
    rawJson: JSON;
  } | null>(null);

  // ────────────────────────────────────────────────────────────────────────────
  // Side effects
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/get/get_doc_detail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ documentId, documentType }),
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setDocumentData({ name: data.name, type: data.type, rawJson: data.rawJson });
      } catch (err) {
        /* eslint‑disable no‑console */
        console.error("Failed to fetch document", err);
        // Fallback demo values so the UI still renders
        setDocumentData({ name: "Document", type: "Unknown", rawJson: {} as JSON });
      }
    }
    load();
  }, [documentId]);

  // Fake email metadata helper copied from the mock‑up
  // not implemented yet, leave as is for now
  function getDocumentMetadata(type: string) {
    const base = {
      date: "2024‑03‑15",
      fromEmail: "supplier@abcmanufacturing.com",
      emailSubject: "Re: Shipment Documentation",
    };
    switch (type) {
      case "MBL":
        return { ...base, emailSubject: "Master Bill of Lading" };
      case "HBL":
        return { ...base, emailSubject: "House Bill of Lading" };
      case "Commercial Invoice":
        return { ...base, emailSubject: "Commercial Invoice" };
      case "Pack List":
        return { ...base, emailSubject: "Packing List" };
      default:
        return base;
    }
  }

  if (!documentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg‑white">
        Loading…
      </div>
    );
  }

  const metadata = getDocumentMetadata(documentData.type);

  // ────────────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <h1>Hi before header</h1>
      {/* Simple top bar (replaces the old nav) */}
      <header className="flex items-center justify-between bg-white border-b border-slate-200 px-6 py-3 shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <div className="flex items-center space-x-3">
          <h2 className="text-base font-semibold text-slate-800 truncate">
            {documentData.name}
          </h2>
          <Badge className="text-xs capitalize">{documentData.type}</Badge>
        </div>
        {/* You can drop in more actions here if needed */}
      </header>
      <h1>Hi after header</h1>
      <div className="flex h-[calc(100vh-72px)]">
        {/* Left: PDF preview */}
        <div className="w-1/2 border-r border-slate-200 bg-white">
          <h1>Hi before pdfviewer</h1>
          <PDFViewer
            documentName={documentData.name}
            documentType={documentData.type}
            metadata={metadata}
            rawJson={documentData.rawJson}
          />
          <h1>Hi after pdfviewer</h1>
        </div>

        {/* Right: extracted fields + AI assistant */}
        <div className="w-1/2 bg-white flex flex-col">
          {/* Field list grows/shrinks based on AI panel visibility */}
          <div
            className={`${isAIVisible ? "flex-[3]" : "flex-1"} border-b border-slate-200 overflow-hidden`}
          >
            <h1>Hi before documentfields</h1>
            <DocumentFields documentType={documentData.type} rawJson={documentData.rawJson} docId={documentId} />
            <h1>Hi after documentfields</h1>
          </div>

          {/* Toggle */}
          <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50">
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
                onClick={() => setIsAIVisible(!isAIVisible)}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 hover:bg-purple-100 font-bold"
              >
                {isAIVisible ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span className="text-sm">History</span>
            </Button>
          </div>

          {isAIVisible && (
            <div className="flex-[2]">
              <AIChatInterface
                activeTab="documents"
                setActiveTab={() => {}}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                hideQuickSuggestions
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

export default DocumentDetails;
