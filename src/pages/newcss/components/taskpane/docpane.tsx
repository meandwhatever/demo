// components/docpane.tsx
import React from "react";
import { Download, X } from "lucide-react";

type Props = {
  docUrl?: string | null;
  onClose: () => void;
  filename?: string;
};

export default function DocPane({
  docUrl,
  onClose,
  filename = "Invoice_12345.pdf",
}: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-3">
        <h2 className="text-sm font-medium text-gray-900">Uploaded Document</h2>
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
          title="Hide uploaded document"
          aria-label="Hide uploaded document"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* File row */}
      <div className="flex items-center gap-2 px-3 py-2 text-sm">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 flex-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
        <span className="truncate">{filename}</span>

        {docUrl ? (
          <a
            href={docUrl}
            download
            className="ml-auto inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
            title="Download"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        ) : (
          <button
            disabled
            className="ml-auto inline-flex cursor-not-allowed items-center gap-1 rounded-md border px-2 py-1 text-xs opacity-60"
            title="No file URL"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        )}
      </div>

      {/* Preview */}
      <div className="flex-1 min-h-0 p-3">
        <div className="h-full w-full overflow-hidden rounded-lg border bg-gray-50">
          {docUrl ? (
            <iframe
              src={docUrl}
              className="h-full w-full"
              title="Document Preview"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              PDF preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
