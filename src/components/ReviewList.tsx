
import { X, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ReviewListProps {
  onClose: () => void;
  onViewDetails?: (hsCode: string, id: string, confidence: number, date: string, product: string, description: string) => void;
  id: string;
  confidence: number;
  date: string;
  product: string;
  description: string;
  hsCode: string;

}

const ReviewList = ({ onClose, onViewDetails, id, confidence, date, product, description, hsCode }: ReviewListProps) => {
  const reviewItems = [
    { 
      date: date, 
      product: product, 
      hsCode: hsCode, 
      description: description,
      confidence: 95,
      reason: 'Below confidence threshold (100%)'
    }
  ];

  const handleViewDetails = (hsCode: string) => {
    if (onViewDetails) {
      onViewDetails(hsCode, id, confidence, date, product, description);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Items Requiring Review</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-slate-600">
            Classifications with confidence scores below the 100% threshold require manual review.
          </p>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>HS Code</TableHead>
              <TableHead>Review Reason</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviewItems.map((item, index) => (
              <TableRow key={index} className="hover:bg-slate-50">
                <TableCell className="text-sm text-slate-600">
                  {item.date}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{item.product}</span>
                    <span className="text-xs text-slate-500">{item.description}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {item.hsCode}
                    </code>
                    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                      {item.confidence}%
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-600">{item.reason}</span>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewDetails(item.hsCode)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-xs">Review</span>
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

export default ReviewList;
