// components/ShippingDelayedPane.tsx
import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, FileText, X } from "lucide-react";

type ProductRow = {
  sku: string;
  docCount: number; // total documents linked to this SKU
};

type Props = {
  onClose: () => void;
  products?: ProductRow[];
  carrier?: {
    name: string;
    phone?: string;
    address?: string;
  };
  defaultComment?: string;
  onUpdateStatus?: (status: string, comment: string) => void;
};

const DEFAULT_PRODUCTS: ProductRow[] = [
  { sku: "HP-851830-BLK-WRD-001", docCount: 3 },
  { sku: "HP-851830-BLK-WRD-002", docCount: 3 },
  { sku: "HP-851830-BLK-WRD-003", docCount: 4 },
  { sku: "HP-851830-BLK-WRD-004", docCount: 4 },
  { sku: "HP-851830-BLK-WRD-005", docCount: 4 },
];

const DEFAULT_CARRIER = {
  name: "XYZ Logistics",
  phone: "+1-555-123-4567",
  address: "456 Commerce Street Los Angeles, CA 90210",
};

function DocsCell({ count }: { count: number }) {
  const visible = Math.min(count, 3);
  const extra = Math.max(0, count - visible);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: visible }).map((_, i) => (
        <FileText key={i} className="h-4 w-4 text-gray-500" aria-hidden />
      ))}
      {extra > 0 && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-700">
          +{extra}
        </span>
      )}
    </div>
  );
}

export default function ShippingDelayedPane({
  onClose,
  products,
  carrier,
  defaultComment = "",
  onUpdateStatus,
}: Props) {
  const rows = products && products.length ? products : DEFAULT_PRODUCTS;
  const info = useMemo(() => ({ ...DEFAULT_CARRIER, ...(carrier || {}) }), [carrier]);

  const [comment, setComment] = useState(defaultComment);
  const [statusOpen, setStatusOpen] = useState(false);
  const [status, setStatus] = useState<string>("Update Status");

  const undoAll = () => {
    setComment(defaultComment || "");
    setStatus("Update Status");
    setStatusOpen(false);
  };

  const applyStatus = (s: string) => {
    setStatus(s);
    setStatusOpen(false);
    (onUpdateStatus || console.log)(s, comment);
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

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {/* Products */}
        <section className="rounded-2xl border bg-slate-50/60 p-4">
          <h3 className="text-base font-semibold text-gray-900">Products</h3>

          <div className="mt-3 overflow-hidden rounded-xl border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">SKU</th>
                  <th className="px-4 py-2 text-left font-medium">Documents</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r) => (
                  <tr key={r.sku} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.sku}</td>
                    <td className="px-4 py-3">
                      <DocsCell count={r.docCount} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Carrier’s Contact Information */}
        <section className="mt-6 rounded-2xl border p-4">
          <h3 className="text-base font-semibold text-gray-900">Carrier’s Contact Information:</h3>
          <p className="mt-1 text-sm text-gray-600">
            For shipping delays, please contact your carrier for more information.
          </p>

          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-gray-900">Name</div>
              <div className="mt-1 text-sm text-gray-800">{info.name}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Contact Number</div>
              <div className="mt-1 text-sm text-gray-800">{info.phone || "—"}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-gray-900">Address</div>
            <div className="mt-1 text-sm text-gray-800">{info.address || "—"}</div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-900">Comments</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Input Comments"
              rows={4}
            />
          </div>
        </section>
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 z-10 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="relative flex items-center justify-end gap-3 p-3">
          <button
            className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={undoAll}
          >
            Undo All Changes
          </button>

          {/* Update Status dropdown */}
          <div className="relative">
            <button
              onClick={() => setStatusOpen((s) => !s)}
              className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {status}
              {statusOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {statusOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-1 w-44 overflow-hidden rounded-md border bg-white shadow-lg"
              >
                {["Contacted Carrier", "Awaiting Response", "Resolved", "Escalated"].map((s) => (
                  <button
                    key={s}
                    onClick={() => applyStatus(s)}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                    role="menuitem"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
