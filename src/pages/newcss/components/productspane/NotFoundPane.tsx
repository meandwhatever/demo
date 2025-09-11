import React from "react";
import { X } from "lucide-react";

export default function NotFoundPane({
  status,
  onClose,
}: {
  status: string;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border bg-white p-6">
      <div className="mb-2 flex items-start justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="text-sm text-gray-600">
        No pane implemented yet for status <span className="font-medium">{status || "Unknown"}</span>.
      </p>
    </div>
  );
}
