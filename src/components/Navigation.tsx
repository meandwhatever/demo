
import { useState } from 'react';
import { User, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Navigation = () => {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-slate-800">Your Company Logo</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            AI Active
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <ChevronDown className="w-4 h-4 text-slate-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Account</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5 text-slate-600" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
