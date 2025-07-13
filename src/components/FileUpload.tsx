
import { useState } from 'react';
import { X, Upload, File, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FileUploadProps {
  onClose: () => void;
}

const FileUpload = ({ onClose }: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.includes('pdf') || file.type.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <Card className="h-full border-0 shadow-none rounded-none">
      <CardHeader className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Upload Files
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-8 w-8 hover:bg-slate-100"
          >
            <X className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-slate-300 hover:border-slate-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Support for PDF, images, and documents
          </p>
          
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="cursor-pointer">
              Browse Files
            </Button>
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file)}
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="p-1 h-6 w-6 hover:bg-slate-200"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setUploadedFiles([])}>
                Clear All
              </Button>
              <Button onClick={() => console.log('Upload files:', uploadedFiles)}>
                Upload Files
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
