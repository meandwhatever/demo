import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function TopNav() {
  return (
    <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-end gap-4 border-b bg-white px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">J</div>
        <span className="text-sm font-medium">Jimmy</span>
        <Button variant="ghost" size="sm" className="bg-white text-white">
          <Settings className="w-5 h-5 text-slate-600" />
        </Button>
      </div>
    </div>
  );
}
