// components/docpane.tsx
import React, { useMemo, useState } from "react";
import { Download, X } from "lucide-react";

export type DocKind = "PO" | "CI" | "PL" | "Shipping Label" | (string & {});
export type DocItem = { type: DocKind; filename: string; path?: string | null };

type Props = {
  docs?: DocItem[];
  onClose?: () => void;
};

const DEFAULT_TABS: DocKind[] = ["PO", "CI", "PL", "Shipping Label"];

// Simple built-in mock data (paths are null so you won't get broken iframes)
const mockDocs: DocItem[] = [
  { type: "PO", filename: "PO_12345.pdf", path: "./src/lib/PO.pdf" },
  { type: "CI", filename: "CI_12345.pdf", path: "./src/lib/Invoice.pdf" },
  { type: "PL", filename: "PL_12345.pdf", path: "./src/lib/PL.pdf" },
  { type: "Shipping Label", filename: "ShippingLabel_12345.pdf", path: null },
];

export default function DocPane({ docs = mockDocs, onClose }: Props) {
  // Prefer first tab that exists in docs; otherwise default to "PO"
  const firstTab = useMemo<DocKind>(() => {
    const available = DEFAULT_TABS.find((t) => docs.some((d) => d.type === t));
    return available ?? "PO";
  }, [docs]);

  const [activeType, setActiveType] = useState<DocKind>(firstTab);
  const activeDoc = docs.find((d) => d.type === activeType);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-3">
        <h2 className="text-sm font-medium text-gray-900">Related Documents</h2>
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
          title="Close"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs (between header and filename) */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        {DEFAULT_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={[
              "rounded-md border px-3 py-1 text-sm transition",
              activeType === t
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filename + download */}
      <div className="flex items-center gap-2 px-3 pb-2 text-sm">
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

        <span className="truncate">
          {activeDoc?.filename ?? `No ${activeType} attached`}
        </span>

        {activeDoc?.path ? (
          <a
            href={activeDoc.path}
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
            title="No file to download"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        )}
      </div>

      {/* Preview */}
      <div className="flex-1 min-h-0 p-3">
        <div className="h-full w-full overflow-hidden rounded-lg border bg-gray-50">
          {activeDoc?.path ? (
            <iframe
              src={activeDoc.path}
              className="h-full w-full"
              title={`${activeType} Preview`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              No {activeType} attached
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
