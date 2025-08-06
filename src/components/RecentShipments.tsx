
import { FileText, List, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';

interface RecentShipmentsProps {
    onViewShipmentDetails?: (
      shipmentId: string,
      mode: string,
    ) => void;
    dbBump: number;
    onDataSaved: () => void;
  }

const RecentDocuments = ({ onViewShipmentDetails, dbBump, onDataSaved }: RecentShipmentsProps) => {
  const navigate = useNavigate();

  type ShipmentRow = {
    id: number;          // internal DB id
    date: string;        // ISO string
    shipmentId: string;  // public shipment reference
    mode: string;        //fcl, lcl, air, road
  };


  const [recentShipments, setRecentShipments] = useState<ShipmentRow[]>([]);

  useEffect(() => {
    fetch('/api/get/get_shipments')
      .then((r) => r.json())
      .then(setRecentShipments)
      .catch(console.error);
  }, [dbBump]);
    console.log('recentShipments', recentShipments);

  const handleViewAll = () => {
    navigate('/shipment-list'); //not implemented yet
  };

  const handleViewShipment = (shipmentId: string, mode: string) => {
    if (onViewShipmentDetails) {
      onViewShipmentDetails(shipmentId, mode);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Recent Shipments</span>
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
              <TableHead>Shipment ID</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentShipments.map((item, index) => (
              <TableRow key={index} className="hover:bg-slate-50">
                <TableCell className="text-sm text-slate-600">
                  {item.date}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-slate-900">{item.shipmentId}</span>
                </TableCell>
                <TableCell>
                  <code className="text-sm font-mono text-green-600 bg-green-50 px-2 py-1 rounded">
                    {item.mode}
                  </code>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewShipment(item.shipmentId.toString(), item.mode)}
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
