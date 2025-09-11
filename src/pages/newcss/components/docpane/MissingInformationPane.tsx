import React, { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronRight, X } from "lucide-react";
import type { DocumentRow } from "../documents";

type Props = {
  document: DocumentRow;
  onClose: () => void;
  onSave?: (payload: {
    id: DocumentRow["id"];
    fields: Record<string, string>;
  }) => void;
};

/** Small helpers */
function Pill({
  children,
  active,
  intent = "ok", // "ok" | "error" | "neutral"
}: {
  children: React.ReactNode;
  active?: boolean;
  intent?: "ok" | "error" | "neutral";
}) {
  const color =
    intent === "error"
      ? "bg-red-100 text-red-700 border-red-200"
      : intent === "ok"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span
      className={[
        "inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium",
        color,
        active ? "ring-2 ring-blue-200" : "",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3"
        aria-expanded={open}
      >
        <div className="text-base font-semibold text-gray-900">{title}</div>
        {open ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  );
}

export default function MissingInformationPane({ document, onClose, onSave }: Props) {
  /** Mocked field state to match the screenshot */
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState({
    shipperName: "", // missing (red)
    shipperAddress: "456 Commerce Street, Los Angeles, CA 90210",
    shipperCountry: "USA",
    shipperCity: "Los Angeles",
    shipperState: "California",
  });

  const errors = useMemo(() => {
    return {
      shipperName: fields.shipperName.trim().length === 0,
    };
  }, [fields.shipperName]);

  const dirty = useMemo(() => editing, [editing]);

  const handleSave = () => {
    onSave?.({ id: document.id, fields });
    setEditing(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border bg-white">
      {/* Header */}
      <div className="flex items-start justify-between rounded-t-2xl px-3 py-3">
        <h2 className="text-xl font-semibold text-gray-900">Digitised Fields</h2>
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
          aria-label="Close"
          title="Close"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Tabs / chips row */}
      <div className="flex flex-wrap gap-2 border-b px-3 pb-3">
        <Pill active intent="error">
          <AlertCircle className="mr-2 h-4 w-4" />
          Involved Parties
        </Pill>
        <Pill intent="ok">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Shipment Details
        </Pill>
        <Pill intent="ok">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Container Details
        </Pill>
        <Pill intent="ok">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Charges
        </Pill>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="mb-2 text-sm font-medium text-gray-700">Involved Parties</div>

        {/* Shipper section */}
        <Section title="Shipper" defaultOpen>
          {/* Name (error) */}
          <label className="mb-2 block text-sm font-medium text-gray-900">
            <span className="inline-flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Name
            </span>
          </label>
          <input
            disabled={!editing}
            value={fields.shipperName}
            onChange={(e) => setFields((p) => ({ ...p, shipperName: e.target.value }))}
            placeholder=""
            className={[
              "mb-4 w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none",
              editing ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "opacity-90",
              errors.shipperName ? "border-red-300" : "border-gray-300",
            ].join(" ")}
          />

          {/* Address (ok) */}
          <label className="mb-2 block text-sm font-medium text-gray-900">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Address
            </span>
          </label>
          <input
            disabled={!editing}
            value={fields.shipperAddress}
            onChange={(e) => setFields((p) => ({ ...p, shipperAddress: e.target.value }))}
            placeholder="Address"
            className={[
              "mb-4 w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none",
              editing ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "opacity-90",
              "border-gray-300",
            ].join(" ")}
          />

          {/* Country (ok) */}
          <label className="mb-2 block text-sm font-medium text-gray-900">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Country
            </span>
          </label>
          <input
            disabled={!editing}
            value={fields.shipperCountry}
            onChange={(e) => setFields((p) => ({ ...p, shipperCountry: e.target.value }))}
            placeholder="Country"
            className={[
              "mb-4 w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none",
              editing ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "opacity-90",
              "border-gray-300",
            ].join(" ")}
          />

          {/* City + State/Province (ok) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  City
                </span>
              </label>
              <input
                disabled={!editing}
                value={fields.shipperCity}
                onChange={(e) => setFields((p) => ({ ...p, shipperCity: e.target.value }))}
                placeholder="City"
                className={[
                  "w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none",
                  editing ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "opacity-90",
                  "border-gray-300",
                ].join(" ")}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  State/Province
                </span>
              </label>
              <input
                disabled={!editing}
                value={fields.shipperState}
                onChange={(e) => setFields((p) => ({ ...p, shipperState: e.target.value }))}
                placeholder="State/Province"
                className={[
                  "w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none",
                  editing ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "opacity-90",
                  "border-gray-300",
                ].join(" ")}
              />
            </div>
          </div>
        </Section>

        {/* Consignee (collapsed mock) */}
        <div className="mt-4">
          <Section title="Consignee" defaultOpen={false}>
            <div className="text-sm text-gray-600">Details coming soon…</div>
          </Section>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="flex items-center justify-end gap-2 border-t px-3 py-3">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={() => setEditing(false)}
              className="rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={errors.shipperName}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              title={errors.shipperName ? "Fill required fields" : "Save"}
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}
