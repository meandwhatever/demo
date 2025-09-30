// components/taskpane/ReviewHSCodePane.tsx
import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
} from "lucide-react";
import type { TaskRow } from "../task";

type Props = {
  onClose: () => void;
  task: TaskRow;
  onStatusChange?: (next: "Open" | "Completed") => void;
};

export default function ReviewHSCodePane({ onClose, task, onStatusChange }: Props) {
  const [phase, setPhase] = useState<"Open" | "Completed">(task.status ?? "Open");
  const [hsCode, setHsCode] = useState<string>(phase === "Completed" ? "8518302000" : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(true);

  const aiSuggested = "8518302000";

  const product = useMemo(
    () => ({
      sku: "HEDD-TWO-GT",
      desc: "HEDDphone TWO GT",
      qty: 10,
      material: "Plastic",
      weight: "50g",
      origin: "China",
      importCountry: "Europe",
      tariffs: "847",
      editedBy: "Jimmy",
      editedDate: "22-04-2025",
    }),
    []
  );

  const validHS = /^\d{6,10}$/.test(hsCode.trim());

  async function callChangeStatus(next: "Open" | "Completed") {
    try {
      setSaving(true);
      setError(null);
      await fetch("/api/newcss/task/changeTaskStatus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status: next }),
      });
    } catch {
      setError("Failed to update status.");
    } finally {
      setSaving(false);
    }
  }

  const handleUndo = () => {
    setHsCode("");
    setError(null);
  };

  const handleApprove = async () => {
    if (!validHS) {
      setError("Enter a valid HS Code (6–10 digits).");
      return;
    }
    await callChangeStatus("Completed");
    setPhase("Completed");
    onStatusChange?.("Completed");
  };

  const handleEdit = async () => {
    await callChangeStatus("Open");
    setPhase("Open");
    onStatusChange?.("Open");
  };

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border bg-white">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 pt-3">
        <h2 className="text-lg font-semibold text-gray-900">Review and Approve HS Code</h2>
        <button
          onClick={onClose}
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-4">
        {/* Intro / prompt — ONLY when Open */}
        {phase === "Open" && (
          <div className="rounded-lg border bg-white p-3">
            <p className="text-lg font-semibold text-gray-900">
              Review and Approve HS Code
            </p>
            <p className="mt-1 text-sm text-gray-700">
              The HS Codes in your documents may be missing, inconsistent, or
              different from the AI-suggested code. Please review and confirm
              the correct HS Code to proceed, or use the AI-suggested code if
              applicable.
            </p>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
              {/* HS Code input */}
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-medium">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-gray-900">
                    <span className="text-red-500">*</span> HS Code
                  </span>
                </label>

                <input
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  placeholder="Enter HS Code"
                  inputMode="numeric"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400 ${
                    hsCode.trim()
                      ? "border-gray-300 focus:border-gray-400"
                      : "border-red-300 focus:border-red-400"
                  }`}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}
              </div>

              {/* Select One: PL / CI */}
              <div className="rounded-md border bg-white p-2 text-sm text-gray-700">
                <div className="font-semibold text-gray-900">Select One:</div>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-500">PL:</div>
                    <div className="text-gray-900">-</div>
                  </div>
                  <div>
                    <div className="text-gray-500">CI:</div>
                    <div className="text-gray-900">-</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI suggestion card */}
            <div className="mt-3 rounded-lg border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Suggested HS Code
                  </span>
                </div>

                <button
                  onClick={() => setHsCode(aiSuggested)}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                  type="button"
                >
                  Select
                </button>
              </div>
              <div className="mt-2 text-base tabular-nums text-gray-900">
                {aiSuggested}
              </div>
              <button
                type="button"
                className="mt-1 text-sm font-medium text-blue-600 hover:underline"
              >
                View Justification
              </button>
            </div>
          </div>
        )}

        {/* Product / Product Details */}
        <section className="mt-4 rounded-lg border bg-white">
          <header
            className="flex items-center justify-between px-3 py-2"
            onClick={() => setDetailsOpen((v) => !v)}
          >
            <h3 className="text-sm font-semibold text-gray-900">
              {phase === "Open" ? "Product Details" : "Product"}
            </h3>
            <button
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50"
              aria-label="Toggle details"
            >
              {detailsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </header>

          {detailsOpen && (
            <div className="px-3 pb-3">
              <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-gray-900 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="SKU Number">{product.sku}</Field>
                <Field label="Product Description">{product.desc}</Field>
                <Field label="Quantity">{product.qty}</Field>
                <Field label="Material">{product.material}</Field>
                <Field label="Weight">{product.weight}</Field>
                <Field label="Country of Origin">{product.origin}</Field>
                <Field label="Import Country">{product.importCountry}</Field>
                <Field label="Tariffs">{product.tariffs}</Field>
              </div>

              {phase === "Completed" && (
                <div className="mt-3 space-y-1">
                  <div
                    className="inline-flex items-center gap-1 text-sm text-gray-600"
                    title={`Edit by: ${product.editedBy}\nLast edit: ${product.editedDate}`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Edited
                  </div>

                  <div className="text-sm">
                    <div className="font-medium text-gray-700">HS Code</div>
                    <div className="mt-0.5 tabular-nums text-gray-900">
                      {hsCode || aiSuggested}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View Justification
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Sticky footer */}
      {phase === "Open" ? (
        <div className="flex items-center justify-between gap-3 border-t bg-white px-3 py-3">
          <button
            onClick={handleUndo}
            disabled={saving}
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Undo All Changes
          </button>
          <button
            onClick={handleApprove}
            disabled={!validHS || saving}
            className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white ${
              !validHS || saving
                ? "cursor-not-allowed bg-blue-300"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Approving..." : "Approve HS Code"}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-3 border-t bg-white px-3 py-3">
          <button
            onClick={handleEdit}
            disabled={saving}
            className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white ${
              saving
                ? "cursor-not-allowed bg-blue-300"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Updating..." : "Edit HS Code"}
          </button>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: React.PropsWithChildren<{ label: string }>) {
  return (
    <p className="text-gray-900">
      <span className="font-medium text-gray-700">{label}:</span>{" "}
      <span>{children}</span>
    </p>
  );
}
