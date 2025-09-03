// components/ActionRail.tsx
import React from "react";
import { Clock3, Edit3, Upload, Maximize2, Sparkles } from "lucide-react";

type Props = {
  className?: string;                 // position override if you want
  onPrimaryClick?: () => void;
  onClock?: () => void;
  onEdit?: () => void;
  onUpload?: () => void;
  onExpand?: () => void;
};

export default function ActionRail({
  className = "fixed right-6 top-28 md:top-24 z-40", // floats on the right
  onPrimaryClick,
  onClock,
  onEdit,
  onUpload,
  onExpand,
}: Props) {
  return (
    <div className="fixed top-28 right-6 self-start bg-blue-500">
      <div className="relative flex flex-col items-center rounded-full border bg-gray-100 p-3 shadow-xl">
        {/* BIG primary circle that slightly overlaps the top */}
        <button
          onClick={onPrimaryClick}
          className="absolute -top-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 shadow-lg ring-4 ring-white"
          aria-label="Primary"
          title="Primary"
        >
          <Sparkles className="h-9 w-9 text-white" />
        </button>

        {/* Rail body */}
        <div className="flex flex-col items-center gap-6 pt-14 pb-2 bg-green-500">
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

          <button
          onClick={onExpand}
          className="p-2 text-gray-900 hover:opacity-80 border border-gray-200 rounded-full"
          aria-label="Expand"
          title="Expand"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
        </div>

        {/* Small white circle at the bottom with expand arrows */}

      </div>
    </div>
  );
}
