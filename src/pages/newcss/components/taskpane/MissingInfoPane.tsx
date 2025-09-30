// components/MissingInfoPane.tsx
import React, { useMemo, useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import type { TaskRow } from "../task";

type Props = {
  onClose: () => void;
  onStatusChange?: (next: "Open" | "Completed") => void;
  task: TaskRow;

  initialSku?: string;
};

export default function MissingInfoPane({
  onClose,
  onStatusChange,
  task,
  
  initialSku,
}: Props) {
  const taskId = task.id;
  const initialStatus = task.status;
  const [phase, setPhase] = useState<"Open" | "Completed">(initialStatus);
  const [sku, setSku] = useState<string>(() => {
    if (initialSku) return initialSku;
    return initialStatus === "Completed" ? "1234" : "";
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Mocked invoice data to match your screenshots ---
  const invoice = useMemo(
    () => ({
      invoiceNo: "GRA-200348",
      date: "14-August-2025",
      currency: "USD",
      countryOfOrigin: "UK",
      blAwbNo: "-",
      finalDestination: "UK",
      exportRoute: "-",
      termsOfSale: "-",
      termsOfPayment: "-",
      termsOfFreight: "-",
      numPackages: "-",
      notes: "RETURN OF UNSOLD STOCK TO ORIGINAL MANUFACTURER",
      shipper: {
        company: "Headphones Inc",
        address: "4210 B St NW, Suite J",
        city: "Auburn",
        state: "WA",
        zip: "98001",
      },
      consignee: {
        company: "Warwick Acoustics",
        address: "MIRA Technology Park – Unit 3, NW07, Watling Street",
        city: "Nuneaton",
        state: "WK",
        zip: "CV10 0TU",
      },
      products: [
        {
          item: "Warwick Acoustics – MIRA Unit",
          hs: "-",
          unitValue: "$5500",
          qty: 4,
          weight: "236.1",
          value: "$22000",
        },
        {
          item: "Warwick Acoustics – System",
          hs: "-",
          unitValue: "6500",
          qty: 6,
          weight: "354",
          value: "$39000",
        },
      ],
      totalValue: "$61000.00",
    }),
    []
  );

  async function callChangeStatus(next: "Open" | "Completed") {
    if (!taskId) return; // graceful no-op if id not provided yet
    try {
      setSaving(true);
      setError(null);
      await fetch("/api/newcss/task/changeTaskStatus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: next }),
      });
    } catch (e) {
      setError("Failed to update status.");
    } finally {
      setSaving(false);
    }
  }

  const handleUndo = () => {
    setSku("");
    setError(null);
  };

  const handleSave = async () => {
    if (!sku.trim()) return;
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
      {/* Top bar (close) */}
      <div className="flex items-center justify-between px-3 pt-3">
        <h2 className="sr-only">Input Missing SKU Number</h2>
        <button
          onClick={onClose}
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          aria-label="Close digitised fields"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-4">
        {/* Header / prompt */}
        <div className="rounded-lg border bg-white p-3">
          <p className="text-lg font-semibold text-gray-900">
            Input Missing SKU Number
          </p>
          <p className="mt-1 text-sm text-gray-700">
            We noticed a SKU Number is missing. Please enter the required SKU
            Number below and save your changes to continue.
          </p>

          {/* Status row */}
          <div className="mt-3">
            <label className="mb-1 flex items-center gap-2 text-sm font-medium">
              {phase === "Open" ? (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-gray-900">
                    <span className="text-red-500">*</span> SKU Number
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-gray-900">SKU Number</span>
                </>
              )}
            </label>

            {phase === "Open" ? (
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Enter SKU Number"
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400 ${
                  sku.trim()
                    ? "border-gray-300 focus:border-gray-400"
                    : "border-red-300 focus:border-red-400"
                }`}
              />
            ) : (
              <div className="rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-900">
                {sku || "1234"}
              </div>
            )}

            {error && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <Section title="Invoice Details" className="mt-4">
          <Grid3>
            <Field label="Invoice No.">{invoice.invoiceNo}</Field>
            <Field label="Date">{invoice.date}</Field>
            <Field label="Currency Used">{invoice.currency}</Field>

            <Field label="Country of Origin">{invoice.countryOfOrigin}</Field>
            <Field label="B/L / AWB No.">{invoice.blAwbNo}</Field>
            <Field label="Final Destination">{invoice.finalDestination}</Field>

            <Field label="Export Route / Carrier">{invoice.exportRoute}</Field>
            <Field label="Terms of Sale">{invoice.termsOfSale}</Field>
            <Field label="Terms of Payment">{invoice.termsOfPayment}</Field>

            <Field label="Terms of Freight">{invoice.termsOfFreight}</Field>
            <Field label="No. of Packages">{invoice.numPackages}</Field>
            <div />
          </Grid3>

          <div className="mt-3">
            <div className="text-sm font-medium text-gray-700">Notes</div>
            <div className="mt-1 rounded-md border bg-white p-2 text-sm text-gray-900">
              {invoice.notes}
            </div>
          </div>
        </Section>

        {/* Shipper / Exporter */}
        <Section title="Shipper/ Exporter" className="mt-4">
          <Grid3>
            <Field label="Company">{invoice.shipper.company}</Field>
            <Field label="Address">{invoice.shipper.address}</Field>
            <Field label="City">{invoice.shipper.city}</Field>
            <Field label="State">{invoice.shipper.state}</Field>
            <Field label="ZIP Code">{invoice.shipper.zip}</Field>
            <div />
          </Grid3>
        </Section>

        {/* Consignee */}
        <Section title="Consignee" className="mt-4">
          <Grid3>
            <Field label="Company">{invoice.consignee.company}</Field>
            <Field label="Address">{invoice.consignee.address}</Field>
            <Field label="City">{invoice.consignee.city}</Field>
            <Field label="State">{invoice.consignee.state}</Field>
            <Field label="ZIP Code">{invoice.consignee.zip}</Field>
            <div />
          </Grid3>
        </Section>

        {/* Products */}
        <Section title="Products" className="mt-4">
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-3 py-2 font-medium">Item &amp; Description</th>
                  <th className="px-3 py-2 font-medium">HS Code</th>
                  <th className="px-3 py-2 font-medium">Unit Value</th>
                  <th className="px-3 py-2 font-medium">Quantity</th>
                  <th className="px-3 py-2 font-medium">Weight</th>
                  <th className="px-3 py-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                {invoice.products.map((p, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="px-3 py-2">{p.item}</td>
                    <td className="px-3 py-2">{p.hs}</td>
                    <td className="px-3 py-2">{p.unitValue}</td>
                    <td className="px-3 py-2">{p.qty}</td>
                    <td className="px-3 py-2">{p.weight}</td>
                    <td className="px-3 py-2">{p.value}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium" colSpan={4}>
                    Subtotal
                  </td>
                  <td className="px-3 py-2">590.00</td>
                  <td className="px-3 py-2">$61000…</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Pricing Summary */}
        <Section title="Pricing Summary" className="mt-4">
          <Grid3>
            <Field label="Freight">-</Field>
            <Field label="Insurance">-</Field>
            <Field label="Total Value">{invoice.totalValue}</Field>
          </Grid3>
        </Section>
      </div>

      {/* Sticky footer (outside scroll area) */}
      {phase === "Open" ? (
        <div className="flex items-center justify-between gap-3 border-t bg-white px-3 py-3">
          <button
            onClick={handleUndo}
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={saving}
          >
            Undo All Changes
          </button>

          <button
            onClick={handleSave}
            disabled={!sku.trim() || saving}
            className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white ${
              !sku.trim() || saving
                ? "cursor-not-allowed bg-blue-300"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-3 border-t bg-white px-3 py-3">
          <button
            onClick={handleEdit}
            disabled={saving}
            className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white ${
              saving ? "cursor-not-allowed bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
            title="Edit SKU Number"
          >
            {saving ? "Updating..." : "Edit SKU Number"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- small helpers ---------- */
function Section({
  title,
  children,
  className = "",
}: React.PropsWithChildren<{ title: string; className?: string }>) {
  return (
    <section className={className}>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function Grid3({ children }: React.PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-gray-900 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: React.PropsWithChildren<{ label: string }>) {
  return (
    <p>
      <span className="font-medium text-gray-700">{label}:</span>{" "}
      <span className="text-gray-900">{children}</span>
    </p>
  );
}
