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
      <header className="flex items-start rounded-t-2xl bg-white p-4 lg:p-5">
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
      <div className="relative grid flex-1 min-h-0 grid-cols-1 gap-5 p-4 lg:grid-cols-12">
        {/* Re-open pill for LEFT (only when left pane is hidden) */}
        {!showDocPane && (
          <button
            onClick={() => setShowDocPane(true)}
            className="absolute left-0 -top-3 z-10 inline-flex items-center gap-2 rounded-r-full rounded-l-none bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            className="absolute right-0 -top-3 z-10 inline-flex items-center gap-2 rounded-l-full rounded-r-none bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            <div className="flex h-full min-h-0 flex-col rounded-2xl border bg-white">
              <div className="flex items-center justify-between border-b p-3">
                <h2 className="text-sm font-medium text-gray-900">
                  Uploaded Document
                </h2>
                <button
                  onClick={() => setShowDocPane(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                  title="Hide"
                  aria-label="Hide uploaded document"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 text-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 flex-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
                </svg>
                <span className="truncate">Invoice_12345.pdf</span>
                <button
                  className="ml-auto inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                  title="Download"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>

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
          </aside>
        )}

        {/* Right: Digitised Fields */}
        {showFieldsPane && (
          <section
            className={`min-h-0 ${
              showDocPane ? "lg:col-span-8" : "lg:col-span-12"
            }`}
          >
            <div className="relative flex h-full min-h-0 flex-col rounded-2xl border bg-white">
              {/* Close (X) for the right pane */}
              <button
                onClick={() => setShowFieldsPane(false)}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                title="Hide digitised fields"
                aria-label="Hide digitised fields"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="border-b p-3 pr-12">
                <h2 className="text-sm font-semibold text-gray-900">
                  Digitised Fields
                </h2>

                {/* Tabs */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-1 rounded-full border bg-gray-900 px-3 py-1.5 text-xs font-medium text-white">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Involved Parties
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    Shipment Details
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    Container Details
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    Charges
                  </button>
                </div>
              </div>

              {/* Scrollable form area */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4">
                {/* Involved Parties -> Shipper */}
                <div className="rounded-xl border">
                  <button
                    className="flex w-full items-center justify-between rounded-t-xl bg-gray-50 px-4 py-3 text-left"
                    type="button"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      Involved Parties
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>

                  <div className="space-y-4 px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      Shipper
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Name */}
                      <label className="col-span-2 flex items-center gap-2 text-sm">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-600">
                          !
                        </span>
                        <span className="font-medium text-gray-900">Name</span>
                      </label>
                      <input
                        className="col-span-2 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        defaultValue="ABC exports"
                      />

                      {/* Address */}
                      <label className="col-span-2 text-sm font-medium text-gray-900">
                        Address
                      </label>
                      <input
                        className="col-span-2 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        defaultValue="456 Commerce Street, Los Angeles, CA 90210"
                      />

                      {/* Country / City / State */}
                      <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-3">
                        <div>
                          <label className="text-sm font-medium text-gray-900">
                            Country
                          </label>
                          <input
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            defaultValue="USA"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-900">
                            City
                          </label>
                          <input
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            defaultValue="Los Angeles"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-900">
                            State/Province
                          </label>
                          <input
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            defaultValue="California"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consignee placeholder block */}
                <div className="mt-4 rounded-xl border px-4 py-3 text-sm text-gray-500">
                  Consignee (placeholder)
                </div>
              </div>

              {/* Sticky footer actions */}
              <div className="sticky bottom-0 z-[1] flex items-center justify-end gap-3 border-t bg-white p-3">
                <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
                  Undo All Changes
                </button>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Save
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
