// components/ActionRail.tsx
import React from "react";
import { Clock3, Edit3, Upload, Maximize2, Sparkles } from "lucide-react";

type Props = {
  className?: string;                 // position override if you want
  onPrimaryClick?: () => void;
  onClock?: () => void;
  onEdit?: () => void;
  onUpload?: () => void;
  onExpand?: () => void;              // <-- Maximize2 will call this
};

export default function ActionRail({
  className = "fixed right-4 top-28", // floats on the right
  onPrimaryClick,
  onClock,
  onEdit,
  onUpload,
  onExpand,
}: Props) {
  return (
    <div className={className}>
      <div className="relative flex flex-col items-center rounded-full border bg-gray-100 p-3 shadow-xl">
      <button
  onClick={onPrimaryClick}
  aria-label="Primary"
  title="Primary"
  className="absolute -top-8 h-20 w-20 rounded-full shadow-lg ring-4 ring-white bg-center bg-cover p-0 bg-red-500"
  style={{ backgroundImage: "url('/src/lib/logo.png')" }}
/>

        {/* Rail body */}
        <div className="flex flex-col items-center gap-6 pt-14 pb-2">
          <button
            onClick={onClock}
            className="p-2 text-gray-900 hover:opacity-80"
            aria-label="History"
            title="History"
          >
            <Clock3 className="h-6 w-6" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-900 hover:opacity-80"
            aria-label="Edit"
            title="Edit"
          >
            <Edit3 className="h-6 w-6" />
          </button>
          <button
            onClick={onUpload}
            className="p-2 text-gray-900 hover:opacity-80"
            aria-label="Upload"
            title="Upload"
          >
            <Upload className="h-6 w-6" />
          </button>

          {/* Expand -> show AI chat, hide rail (handled by parent via onExpand) */}
          <button
            onClick={onExpand}
            className="p-2 text-gray-900 hover:opacity-80 border border-gray-200 rounded-full"
            aria-label="Expand"
            title="Expand"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
