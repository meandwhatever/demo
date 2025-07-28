import { useState, useEffect } from 'react';
import { Clock, List, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';

interface RecentClassificationsProps {
  onViewDetails?: (hsCode: string, id: string, confidence: number, date: string, product: string, description: string) => void;
  dbBump: number;
  onDataSaved: () => void;
}

type Row = {
  id: string;
  date: string;            // YYYY-MM-DD
  product: string;
  description: string;
  hsCode: string;
  confidence: number;      // 0–100 (already percentage)
};

const RecentClassifications = ({ onViewDetails, dbBump, onDataSaved }: RecentClassificationsProps) => {
  const [recentClassifications, setRecentClassifications] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/get_classification?limit=5');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as {
          id: string;
          createdAt: string;
          product_title: string;
          product_description: string;
          hs_code: string;
          confidence: string;
        }[];

        const rows: Row[] = data.map((c) => ({
          id: c.id,
          date: c.createdAt.slice(0, 10),              // keep YYYY-MM-DD
          product: c.product_title,
          description: c.product_description,
          hsCode: c.hs_code,
          confidence: Math.round(parseFloat(c.confidence)), // Decimal → %
        }));
        setRecentClassifications(rows);
      } catch (err) {
        console.error('recent-classifications-fetch-error', err);
      }
    })();
  }, [dbBump]);

  const handleViewDetails = (hsCode: string, id: string, confidence: number, date: string, product: string, description: string) => {
    if (onViewDetails) {
      onViewDetails(hsCode, id, confidence, date, product, description);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Recent Classifications</span>
          </div>
          <Link to="/classifications">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <List className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-600">All</span>
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>HS Code</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentClassifications.map((item, index) => (
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
                    <Badge variant="outline" className="text-xs">
                      {item.confidence}%
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewDetails(
                      item.hsCode,
                      item.id,
                      item.confidence,
                      item.date,
                      item.product,
                      item.description,
                    )}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-xs">View Details</span>
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

export default RecentClassifications;
