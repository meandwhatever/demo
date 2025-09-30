// components/taskpane/DiscrepancyPane.tsx
import React, { useMemo, useState } from "react";
import {
  X,
  AlertCircle,
  CheckCircle2,
  Info,
  Pencil,
  Undo2,
} from "lucide-react";
import type { TaskRow } from "../task"; // optional; only for typing if you pass a task in

type Status = "Open" | "Completed";

type Props = {
  onClose: () => void;
  /** Optional: the task we’re resolving. If omitted we assume status Open. */
  task?: TaskRow;
  /** Optional: notify parent when status flips Open/Completed */
  onStatusChange?: (next: Status) => void;
};

/**
 * Review & Resolve Discrepancies
 * - Modes:
 *   - "open": user must select/enter Qty then Save
 *   - "completed": read-only summary + Edit button
 *   - "editing": like open, but with Cancel and Undo All Changes
 */
export default function DiscrepancyPane({
  onClose,
  task,
  onStatusChange,
}: Props) {
  // ----- MOCK source values (from PO vs CI) -----
  const poQty = 10;
  const ciQty = 11;
  const unitCost = "EUR 1,099.50";

  // ----- Derived initial mode from task.status (if provided) -----
  const initialMode: Mode =
    (task?.status ?? "Open") === "Completed" ? "completed" : "open";

  type Mode = "open" | "completed" | "editing";
  const [mode, setMode] = useState<Mode>(initialMode);

  // Which source is picked in the "Select One" radios?
  // null means not picked yet (valid in "open")
  const [picked, setPicked] = useState<"PO" | "CI" | null>(null);

  // Freeform qty input — when a radio is selected we populate it for clarity.
  const [qty, setQty] = useState<string>(mode === "completed" ? String(poQty) : "");

  // Show validation only when trying to save with missing qty
  const [attemptedSave, setAttemptedSave] = useState(false);

  // Helpers
  const hasQty = qty.trim().length > 0;
  const matchesBadgeText = useMemo(() => {
    // In your screenshots:
    // - "1 Discrepancy" when open and not resolved
    // - After resolving qty, we effectively have "2 Matches"
    return mode === "open" ? "1 Discrepancy" : "2 Matches";
  }, [mode]);

  function setStatus(next: Status) {
    onStatusChange?.(next);
  }

  function handlePick(source: "PO" | "CI") {
    setPicked(source);
    setQty(String(source === "PO" ? poQty : ciQty));
  }

  async function handleUndoAll() {
    // Back to original unresolved state
    setPicked(null);
    setQty("");
    setAttemptedSave(false);
    setMode("open");
    setStatus("Open");
    await fetch("/api/newcss/task/changeTaskStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, status: "Open" }),
    });
  }

  async function handleSave() {
    setAttemptedSave(true);
    if (!hasQty) return; // keep user in place until qty is provided

    // In a real app, persist the decision here, then:
    setMode("completed");
    setStatus("Completed");
    await fetch("/api/newcss/task/changeTaskStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, status: "Completed" }),
    });
  }

  function handleEdit() {
    // Enter editing (keeps current qty and picked as starting point)
    setMode("editing");
  }

  function handleCancel() {
    // Return to completed summary without changing anything further
    setMode("completed");
  }

  // ----- UI blocks -----
  const Header = (
    <header className="flex items-start justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Review &amp; Resolve Discrepancies
        </h2>
        {/* Status pill (Discrepancy vs Matches) */}
        <div className="mt-2">
          {mode === "open" ? (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
              {matchesBadgeText}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">
              {matchesBadgeText}
            </span>
          )}
        </div>

        {/* Helper copy */}
        <p className="mt-3 max-w-prose text-sm text-gray-700">
          We’ve detected discrepancy between your documents. Please select a
          value for each field to proceed with validating your changes.
        </p>
      </div>

      <button
        onClick={onClose}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
        aria-label="Close"
        title="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </header>
  );

  const QtyRowOpenOrEditing = (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Left: Qty input */}
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {mode === "open" && !hasQty && attemptedSave ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : (
            <CheckCircle2
              className={`h-4 w-4 ${
                hasQty ? "text-green-600" : "text-gray-300"
              }`}
            />
          )}
          <span>Qty</span>
        </div>

        <div className="relative mt-2">
          <input
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Enter Qty"
            className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition ${
              !hasQty && attemptedSave
                ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                : "border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            }`}
            inputMode="numeric"
          />
          {qty && (
            <button
              type="button"
              onClick={() => setQty("")}
              className="absolute inset-y-0 right-2 inline-flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Clear"
              title="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Select One */}
      <div>
        <div className="text-sm font-medium text-gray-700">Select One:</div>
        <div className="mt-2 space-y-3 text-sm">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="qty-source"
              className="h-4 w-4 accent-blue-600"
              checked={picked === "PO"}
              onChange={() => handlePick("PO")}
            />
            <span className="text-gray-600">
              <span className="font-medium">PO:</span> {poQty}
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="qty-source"
              className="h-4 w-4 accent-blue-600"
              checked={picked === "CI"}
              onChange={() => handlePick("CI")}
            />
            <span className="text-gray-600">
              <span className="font-medium">CI:</span> {ciQty}
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const QtyRowCompleted = (
    <div className="mt-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <span className="text-gray-700">Edited</span>
        {/* quick "tooltip" using title attr */}
        <Info
          className="h-4 w-4 text-gray-400"
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div className="text-sm text-gray-700">Qty</div>
          <div className="mt-1 text-lg font-semibold text-gray-900 tabular-nums">
            {qty || poQty}
          </div>
        </div>
        <div className="text-sm text-gray-700">
          <div>
            <span className="font-medium text-gray-600">PO:</span>{" "}
            <span className="tabular-nums">{poQty}</span>
          </div>
          <div className="mt-1">
            <span className="font-medium text-gray-600">CI:</span>{" "}
            <span className="tabular-nums">{ciQty}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const MatchRow = (
    <div className="mt-6 border-t pt-6">
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">
        1 Match
      </span>
      <p className="mt-2 text-sm text-gray-700">
        This field matches in all extracted documents. No further action
        required.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
          <div>
            <div className="text-sm font-medium text-gray-700">Unit Cost</div>
            <div className="text-lg font-semibold text-gray-900">
              {unitCost}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-700">
          <div>
            <span className="font-medium text-gray-600">PO:</span>{" "}
            {unitCost}
          </div>
          <div className="mt-1">
            <span className="font-medium text-gray-600">CI:</span>{" "}
            {unitCost}
          </div>
        </div>
      </div>
    </div>
  );

  const FooterOpen = (
    <div className="mt-8 flex items-center justify-end">


      <button
        type="button"
        onClick={handleSave}
        disabled={!hasQty}
        className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm ${
          hasQty
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-300 cursor-not-allowed"
        }`}
      >
        Save
      </button>
    </div>
  );

  const FooterCompleted = (
    <div className="mt-8 flex items-center justify-end">
      <button
        type="button"
        onClick={handleEdit}
        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        <Pencil className="h-4 w-4" />
        Edit
      </button>
    </div>
  );

  const FooterEditing = (
    <div className="mt-8 flex items-center justify-between">
      <button
        type="button"
        onClick={handleUndoAll}
        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        title="Undo all changes"
      >
        <Undo2 className="h-4 w-4" />
        Undo All Changes
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasQty}
          className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm ${
            hasQty
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );

  return (
    
    <section className="flex h-full min-h-0 flex-col rounded-2xl border bg-white p-4 shadow-sm shadow-gray-200 lg:p-5">
      <h1>task.id: {task?.id}</h1>
      {Header}

      {/* Body */}
      {mode === "completed" ? (
        <>
          {QtyRowCompleted}
          {MatchRow}
          {FooterCompleted}
        </>
      ) : mode === "open" ? (
        <>
          {QtyRowOpenOrEditing}
          {MatchRow}
          {FooterOpen}
        </>
      ) : (
        // editing
        <>
          {QtyRowOpenOrEditing}
          {MatchRow}
          {FooterEditing}
        </>
      )}
    </section>
  );
}
