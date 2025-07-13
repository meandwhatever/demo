
import { AlertTriangle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AlertsAndActionsProps {
  onShowDetails: (title: string) => void;
  onShowReviewList: () => void;
}

const AlertsAndActions = ({ onShowDetails, onShowReviewList }: AlertsAndActionsProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <span>Alerts and Actions Required</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/*
          <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="text-sm font-medium text-slate-900">Review Required</h4>
                <p className="text-xs text-slate-600">Digital camera classification needs review</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                    95% confidence
                  </Badge>
                  <span className="text-xs text-slate-500">Below 100% threshold</span>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShowReviewList}
              className="flex items-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span className="text-xs">Review</span>
            </Button>
          </div>
          */}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsAndActions;
