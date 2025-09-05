// components/DiscrepancyPane.tsx
import React, { useMemo, useState } from "react";
import { X, Check } from "lucide-react";

type Source = "MBL" | "HBL";

type DiscrepancyField = {
  id: string;
  label: string;
  mbl: string;
  hbl: string;
  // optional free-typed override (left input)
  override?: string;
  // which side the user picked
  chosen?: Source;
};

type Props = {
  onClose: () => void;
  onSave?: (resolved: Array<{ id: string; value: string; source: Source | "OVERRIDE" }>) => void;
  initial?: DiscrepancyField[];
};

const DEFAULT_FIELDS: DiscrepancyField[] = [
  {
    id: "port_of_discharge",
    label: "Port of Discharge",
    mbl: "Long Beach, CA",
    hbl: "Shanghai, China",
  },
  {
    id: "port_of_loading",
    label: "Port of Loading",
    mbl: "Los Angeles,USA",
    hbl: "Shanghai, China",
  },
  {
    id: "vessel",
    label: "Vessel",
    mbl: "Oceanic Star",
    hbl: "12345",
  },
  // Matches are shown below as read-only (example)
];

export default function DiscrepancyPane({ onClose, onSave, initial }: Props) {
  const [fields, setFields] = useState<DiscrepancyField[]>(
    initial && initial.length ? initial : DEFAULT_FIELDS
  );

  const { discrepancyCount, matchCount } = useMemo(() => {
    // if values differ => discrepancy; same => match
    let d = 0;
    let m = 0;
    fields.forEach((f) => {
      if (f.mbl.trim() === f.hbl.trim()) m += 1;
      else d += 1;
    });
    // demo-only matches
    const demoMatches = 2; // e.g., Mode, Incoterms, etc. (displayed below)
    return { discrepancyCount: d, matchCount: demoMatches };
  }, [fields]);

  const handlePick = (id: string, side: Source) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, chosen: side, override: undefined } : f))
    );
  };

  const handleOverride = (id: string, val: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, override: val, chosen: undefined } : f))
    );
  };

  const currentValue = (f: DiscrepancyField) =>
    f.override ?? (f.chosen === "MBL" ? f.mbl : f.chosen === "HBL" ? f.hbl : "");

  const handleSave = () => {
    const payload = fields.map((f) => {
      const usingOverride = f.override != null && f.override !== "";
      return {
        id: f.id,
        value: usingOverride ? f.override! : f.chosen === "MBL" ? f.mbl : f.hbl,
        source: usingOverride ? ("OVERRIDE" as const) : (f.chosen ?? "MBL"),
      };
    });
    onSave ? onSave(payload) : console.log("Resolved payload:", payload);
  };

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

      {/* Header */}
      <div className="border-b p-4 pr-12">
        <h2 className="text-base font-semibold text-gray-900">Review &amp; Resolve Discrepancies</h2>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 font-medium text-red-700">
            {discrepancyCount} Discrepanc{discrepancyCount === 1 ? "y" : "ies"}
          </span>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 font-medium text-green-700">
            {matchCount} Matches
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          We’ve detected discrepancies between your documents. Please select a value for each field to proceed with validating your changes.
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="divide-y">
          {fields.map((f) => (
            <div key={f.id} className="grid gap-4 py-4 md:grid-cols-[minmax(0,1fr)_auto]">
              {/* Left: editable value box */}
              <div>
                <label className="block text-sm font-medium text-gray-900">{f.label}</label>
                <input
                  value={currentValue(f)}
                  onChange={(e) => handleOverride(f.id, e.target.value)}
                  placeholder="Select or type a value"
                  className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              {/* Right: radio pickers */}
              <div className="md:pl-6">
                <div className="text-xs font-medium text-gray-500">Select one:</div>
                <div className="mt-2 space-y-3 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`src-${f.id}`}
                      className="h-4 w-4"
                      checked={f.chosen === "MBL" && !f.override}
                      onChange={() => handlePick(f.id, "MBL")}
                    />
                    <span>
                      <span className="font-medium">MBL:</span> {f.mbl}
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`src-${f.id}`}
                      className="h-4 w-4"
                      checked={f.chosen === "HBL" && !f.override}
                      onChange={() => handlePick(f.id, "HBL")}
                    />
                    <span>
                      <span className="font-medium">HBL:</span> {f.hbl}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Example Matches section (read-only preview) */}
        <div className="mt-6 rounded-xl border">
          <div className="flex items-center gap-2 rounded-t-xl bg-green-50 px-4 py-3">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">{matchCount} Matches</span>
          </div>
          <div className="space-y-3 px-4 py-4 text-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="text-gray-500">Mode:</div>
                <div className="mt-1 font-medium text-gray-900">Ocean</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-gray-700">
                <div><span className="font-medium">MBL:</span> Ocean</div>
                <div><span className="font-medium">HBL:</span> Ocean</div>
              </div>
            </div>
            {/* Add more matched lines if desired */}
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 z-10 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex items-center justify-end gap-3 p-3">
          <button
            className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setFields(initial && initial.length ? initial : DEFAULT_FIELDS)}
          >
            Undo All Changes
          </button>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
