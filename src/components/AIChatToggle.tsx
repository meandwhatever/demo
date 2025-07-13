
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIChatToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

const AIChatToggle = ({ isVisible, onToggle }: AIChatToggleProps) => {
  return (
    <div className="border-t border-slate-200 bg-slate-50">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onToggle}
        className="w-full flex items-center justify-center space-x-2 py-2 hover:bg-slate-100"
      >
        {isVisible ? (
          <>
            <ChevronDown className="w-4 h-4" />
            <span className="text-xs text-slate-600">Hide AI Chat</span>
          </>
        ) : (
          <>
            <ChevronUp className="w-4 h-4" />
            <span className="text-xs text-slate-600">Show AI Chat</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default AIChatToggle;
