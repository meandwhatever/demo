// components/NotFoundPane.tsx
import React from "react";
import { CircleHelp, X } from "lucide-react";

type Props = {
  onClose: () => void;
  taskType?: string;
  supported?: string[];
};

export default function NotFoundPane({
  onClose,
  taskType,
  supported = ["Missing Information", "Discrepancy", "Shipping Delayed", "Customs Delayed"],
}: Props) {
  return (
    <div className="relative flex h-full min-h-0 flex-col rounded-2xl border bg-white">
      {/* Close (X) */}
      <button
        onClick={onClose}
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
        title="Close"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Body */}
      <div className="flex-1 min-h-0 px-6 py-10">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <CircleHelp className="h-6 w-6 text-gray-600" />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">No view for this task type</h2>
          <p className="mt-2 text-sm text-gray-600">
            This task is labeled <span className="font-medium text-gray-900">“{taskType}”</span>.
            We don’t have a dedicated panel for it yet.
          </p>

          <div className="mt-6 w-full rounded-xl border bg-gray-50 p-4 text-left">
            <div className="text-sm font-medium text-gray-900">Supported types</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {supported.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={onClose}
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
