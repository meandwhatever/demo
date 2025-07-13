
import { History, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AuditTrail = () => {
  const auditTrail = [
    { action: 'Classification Updated', item: 'Product #12345', user: 'John Doe', time: '1 hour ago' },
    { action: 'Review Completed', item: 'Batch #789', user: 'Jane Smith', time: '3 hours ago' },
    { action: 'Document Uploaded', item: 'Invoice #456', user: 'Mike Johnson', time: '5 hours ago' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-slate-600" />
            <span>Audit Trail</span>
          </div>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <List className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600">All</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {auditTrail.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-900">{item.action}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.item}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">by {item.user} • {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditTrail;
