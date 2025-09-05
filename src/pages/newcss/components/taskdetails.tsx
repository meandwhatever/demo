// components/TaskDetails.tsx
import React, { useState } from "react";
import ActionRail from "./actionrails";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Download,
  Upload,
  FileText,
  X,
} from "lucide-react";
import type { TaskRow } from "./task";
import DocPane from "./taskpane/docpane";
import DigitisedFieldsPane from "./taskpane/DigitisedFieldsPane";



type Props = {
  task: TaskRow;
  onBack: () => void;
  docUrl?: string; // optional: if you have a real file URL, pass it in
};

export default function TaskDetails({ task, onBack, docUrl }: Props) {
  // Left Uploaded Doc pane visibility
  const [showDocPane, setShowDocPane] = useState(true);
  // Right Digitised Fields pane visibility
  const [showFieldsPane, setShowFieldsPane] = useState(true);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl bg-white shadow-sm shadow-gray-200">
      {/* Header */}
      <header className="flex items-start rounded-t-2xl bg-white p-2">
        <div className="w-full">
          {/* Row 1: Back button + Title */}
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
              {task.type || "Missing Information"}
            </h1>
          </div>

          {/* Row 2: Metadata */}
          <div className="mt-2 grid grid-cols-1 gap-x-8 gap-y-1 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
            <p>
              <span className="font-medium">Document Type:</span>{" "}
              <span className="text-gray-800">Invoice</span>
            </p>
            <p>
              <span className="font-medium">Task Status:</span>{" "}
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                Open
              </span>
            </p>
            <p>
              <span className="font-medium">Document Source:</span>{" "}
              <span className="text-gray-800">File upload</span>
            </p>
            <p>
              <span className="font-medium">Processing Date:</span>{" "}
              <span className="text-gray-800">DD-MM-YYYY</span>
            </p>
            <p>
              <span className="font-medium">SKU Number:</span>{" "}
              <span className="text-gray-900">{task.sku}</span>
            </p>
            <p>
              <span className="font-medium">Shipment ID:</span>{" "}
              <a className="text-blue-600 hover:underline" href="#">
                SH-001
              </a>
            </p>
          </div>
        </div>
      </header>

{/* Body */}
<div className="relative grid flex-1 min-h-0 grid-cols-1 gap-2 p-2 lg:grid-cols-12 bg-white">
  {/* Re-open pill for LEFT (only when left pane is hidden) */}
  {!showDocPane && (
    <button
      onClick={() => setShowDocPane(true)}
      className="absolute left-0 -top-3 z-10 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
      title="Show uploaded document"
      aria-label="Show uploaded document"
    >
      <Upload className="h-4 w-4" />
      Uploaded Doc
      <ChevronRight className="h-4 w-4" />
    </button>
  )}

  {/* Re-open pill for RIGHT (only when right pane is hidden) */}
  {!showFieldsPane && (
    <button
      onClick={() => setShowFieldsPane(true)}
      className="absolute right-0 -top-3 z-10 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
      title="Show digitised fields"
      aria-label="Show digitised fields"
    >
      <FileText className="h-4 w-4" />
      Digitised Fields
      <ChevronLeft className="h-4 w-4" />
    </button>
  )}

  {/* Left: Uploaded Document */}
  {showDocPane && (
    <aside
      className={`min-h-0 ${
        showFieldsPane ? "lg:col-span-4" : "lg:col-span-12"
      }`}
    >
      <DocPane
        docUrl={docUrl}
        onClose={() => setShowDocPane(false)}
      />
    </aside>
  )}

  {/* Right: Digitised Fields */}
  {showFieldsPane && (
    <section
      className={`min-h-0 ${
        showDocPane ? "lg:col-span-8" : "lg:col-span-12"
      }`}
    >
      <DigitisedFieldsPane onClose={() => setShowFieldsPane(false)} taskType={task.type} />
    </section>
  )}
</div>

    </div>
  );
}
