
import { FileText, List, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';

interface RecentDocumentsProps {
      onViewDocumentDetails?: (
        documentId: string,
        documentType: 'mbl' | 'hbl'
      ) => void;
}

const RecentDocuments = ({ onViewDocumentDetails }: RecentDocumentsProps) => {
  const navigate = useNavigate();

    // Live data will be injected here via API fetch in a future step
     type DocumentRow = {
      id: number;
      date: string;            // ISO string for easy formatting on the client
      documentName: string;
      documentType: 'mbl' | 'hbl';
    };


  const [recentDocuments, setRecentDocuments] = useState<DocumentRow[]>([]);

  useEffect(() => {
    fetch('/api/get/get_doc')
      .then((r) => r.json())
      .then(setRecentDocuments)
      .catch(console.error);
  }, []);
    

  const handleViewAll = () => {
    navigate('/document-list');
  };

  const handleViewDocument = (documentId: string, documentType: 'mbl' | 'hbl') => {
    if (onViewDocumentDetails) {
      onViewDocumentDetails(documentId,documentType);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Recent Documents</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-1"
            onClick={handleViewAll}
          >
            <List className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600">All</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Document Name</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentDocuments.map((item, index) => (
              <TableRow key={index} className="hover:bg-slate-50">
                <TableCell className="text-sm text-slate-600">
                  {item.date}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-slate-900">{item.documentName}</span>
                </TableCell>
                <TableCell>
                  <code className="text-sm font-mono text-green-600 bg-green-50 px-2 py-1 rounded">
                    {item.documentType}
                  </code>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewDocument(item.id.toString(), item.documentType)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-xs">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentDocuments;
