import { FileText, Download, ZoomIn, ZoomOut, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PDFViewerProps {
  documentName?: string;
  documentType?: string;
  documentUrl?: string;
  metadata?: {
    date: string;
    fromEmail: string;
    emailSubject: string;
  };
  rawJson?: Record<string, any>;
}

const PDFViewer = ({ documentName = 'Document.pdf', documentType = 'Unknown', metadata, rawJson, documentUrl }: PDFViewerProps) => {

  console.log('documentUrl', documentUrl);
  const url = "/my-next-backend copy/public" + documentUrl;
  return (
    <div className="h-full flex flex-col">
      {/* PDF Controls */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-slate-900">{documentName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-600">100%</span>
            <Button variant="ghost" size="sm">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Document Metadata */}
        {metadata && (
          <div className="space-y-1 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Date:</span>
              <span>{metadata.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span className="font-medium">From:</span>
              <a 
                href={`mailto:${metadata.fromEmail}?subject=${encodeURIComponent(metadata.emailSubject)}`}
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1"
              >
                <span>{metadata.emailSubject}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 p-4 overflow-auto bg-slate-50">

          {documentUrl ? (
            <iframe
              src={url}
              title={documentName}
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              No preview available
            </div>
          )}

      </div>
    </div>
  );
};

export default PDFViewer;
