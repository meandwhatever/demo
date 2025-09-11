import React, { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import type { DocumentRow } from "../documents";

type Props = {
  document: DocumentRow;
  onClose: () => void;
};

type ChoiceKey = "pod" | "pol" | "vessel";
type Side = "mbl" | "hbl";

const FIELD_CONFIG: Record<
  ChoiceKey,
  { label: string; placeholder: string; options: Record<Side, string> }
> = {
  pod: {
    label: "Port of Discharge",
    placeholder: "Enter Port of Discharge",
    options: { mbl: "Long Beach, CA", hbl: "Shanghai, China" },
  },
  pol: {
    label: "Port of Loading",
    placeholder: "Enter Port of Loading",
    options: { mbl: "Los Angeles, USA", hbl: "Shanghai, China" },
  },
  vessel: {
    label: "Vessel",
    placeholder: "Enter Vessel",
    options: { mbl: "Oceanic Star", hbl: "12345" },
  },
};

export default function DiscrepanciesPane({ document, onClose }: Props) {
  const [inputs, setInputs] = useState<Record<ChoiceKey, string>>({
    pod: "",
    pol: "",
    vessel: "",
  });
  const [selected, setSelected] = useState<Record<ChoiceKey, Side | null>>({
    pod: null,
    pol: null,
    vessel: null,
  });

  const dirty = useMemo(
    () =>
      (Object.values(inputs).some(Boolean) ||
        (selected.pod || selected.pol || selected.vessel)),
    [inputs, selected]
  );

  const undoAll = () => {
    setInputs({ pod: "", pol: "", vessel: "" });
    setSelected({ pod: null, pol: null, vessel: null });
  };

  const save = () => {
    // Wire this to your API when ready
    const payload = {
      id: document.id,
      resolve: {
        pod: selected.pod ? FIELD_CONFIG.pod.options[selected.pod] : inputs.pod,
        pol: selected.pol ? FIELD_CONFIG.pol.options[selected.pol] : inputs.pol,
        vessel: selected.vessel ? FIELD_CONFIG.vessel.options[selected.vessel] : inputs.vessel,
      },
    };
    // eslint-disable-next-line no-console
    console.log("Save Discrepancy Resolution", payload);
  };

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
            3 Discrepancies
          </span>
          <h2 className="text-lg font-semibold text-gray-900">Review &amp; Resolve Discrepancies</h2>
        </div>
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
          aria-label="Close"
          title="Close"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <p className="px-3 text-sm text-gray-600">
        We’ve detected discrepancies between your documents. Please select a value for each field
        to proceed with validating your changes.
      </p>

      {/* Body */}
      <div className="mt-3 flex-1 overflow-y-auto px-3 pb-3">
        {(["pod", "pol", "vessel"] as ChoiceKey[]).map((key, idx) => {
          const cfg = FIELD_CONFIG[key];
          const showDivider = idx < 2;
          return (
            <div key={key} className="py-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Left: input with red icon/label */}
                <div>
                  <div className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-800">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    {cfg.label}
                  </div>
                  <input
                    value={inputs[key]}
                    onChange={(e) => setInputs((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={cfg.placeholder}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {/* Right: radio choices */}
                <div>
                  <div className="mb-2 text-sm text-gray-600">Select one:</div>
                  <label className="mb-2 flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name={`choice-${key}`}
                      checked={selected[key] === "mbl"}
                      onChange={() =>
                        setSelected((p) => ({ ...p, [key]: "mbl" }))
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-gray-800">
                      <span className="font-semibold">MBL:</span>{" "}
                      {cfg.options.mbl}
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name={`choice-${key}`}
                      checked={selected[key] === "hbl"}
                      onChange={() =>
                        setSelected((p) => ({ ...p, [key]: "hbl" }))
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-gray-800">
                      <span className="font-semibold">HBL:</span>{" "}
                      {cfg.options.hbl}
                    </span>
                  </label>
                </div>
              </div>

              {showDivider && <hr className="mt-4 border-gray-200" />}
            </div>
          );
        })}

        {/* Matches */}
        <div className="mt-2 rounded-xl border border-green-200 bg-green-50 p-3">
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            2 Matches
          </span>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
              <div className="text-sm">
                <div className="font-medium">Mode:</div>
                <div className="text-gray-700">Ocean</div>
              </div>
            </div>

            <div className="text-sm">
              <div className="font-medium">MBL:</div>
              <div className="text-gray-700">Ocean</div>
              <div className="mt-2 font-medium">HBL:</div>
              <div className="text-gray-700">Ocean</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 border-t px-3 py-3">
        <button
          onClick={undoAll}
          disabled={!dirty}
          className="rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Undo All Changes
        </button>
        <button
          onClick={save}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}
