import React, { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Upload } from "lucide-react";
import type { DocumentRow } from "./documents"; // <- from your Documents table file
import DocPane from "./taskpane/docpane";       // re-use the same doc viewer
import DocumentsPane from "./docpane/DocumentsPane";

type Props = {
  document: DocumentRow;
  onBack: () => void;
  docUrl?: string;
};

export default function DocumentsDetails({ document, onBack, docUrl }: Props) {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl bg-white shadow-sm shadow-gray-200">
      {/* Header */}
      <header className="flex items-start rounded-t-2xl bg-white p-2">
        <div className="w-full">
          {/* Row 1: Back + Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-gray-50"
              aria-label="Back"
              title="Back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>

            <h1 className="text-xl font-semibold text-gray-900">
              {document.status || "Document Details"}
            </h1>
          </div>

          {/* Row 2: Metadata */}
          <div className="mt-2 grid grid-cols-1 gap-x-8 gap-y-1 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
            <p>
              <span className="font-medium">Name:</span>{" "}
              <span className="text-gray-900">{document.name}</span>
            </p>
            <p>
              <span className="font-medium">SKU:</span>{" "}
              <span className="text-gray-900">{document.sku}</span>
            </p>
            <p>
              <span className="font-medium">Type:</span>{" "}
              <span className="text-gray-900">{document.docType}</span>
            </p>
            <p>
              <span className="font-medium">Source:</span>{" "}
              <span className="text-gray-900">{document.source}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="relative grid flex-1 min-h-0 grid-cols-1 gap-2 p-2 lg:grid-cols-12 bg-white">
        {/* Re-open LEFT */}
        {!showLeft && (
          <button
            onClick={() => setShowLeft(true)}
            className="absolute left-0 -top-3 z-10 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
            title="Show related docs"
            aria-label="Show related docs"
          >
            <Upload className="h-4 w-4" />
            Related Docs
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Re-open RIGHT */}
        {!showRight && (
          <button
            onClick={() => setShowRight(true)}
            className="absolute right-0 -top-3 z-10 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
            title="Show document pane"
            aria-label="Show document pane"
          >
            <FileText className="h-4 w-4" />
            Document Pane
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* Left: Doc viewer */}
        {showLeft && (
          <aside className={`min-h-0 ${showRight ? "lg:col-span-4" : "lg:col-span-12"}`}>
            <DocPane  onClose={() => setShowLeft(false)} />
          </aside>
        )}

        {/* Right: dynamic pane (switch by document.status) */}
        {showRight && (
          <section className={`min-h-0 ${showLeft ? "lg:col-span-8" : "lg:col-span-12"}`}>
            <DocumentsPane
              document={document}
              onClose={() => setShowRight(false)}
            />
          </section>
        )}
      </div>
    </div>
  );
}
