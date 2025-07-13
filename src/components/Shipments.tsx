
import { Ship, List, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Shipments = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/shipment-list');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ship className="w-5 h-5 text-blue-600" />
            <span>Recent Document</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-1"
            onClick={handleViewAll}
          >
            <List className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600">View All</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content area left blank as requested */}
      </CardContent>
    </Card>
  );
};

export default Shipments;
