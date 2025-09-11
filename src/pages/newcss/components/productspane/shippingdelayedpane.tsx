// src/taskpane/ShippingDelayedPane.tsx
import React from "react";
import type { ProductRow } from "../products";
import { X, ChevronDown, FileText } from "lucide-react";

type Props = {
  /** Single selected product row */
  product: ProductRow;
  onClose: () => void;
};

export default function ShippingDelayedPane({ product, onClose }: Props) {
  // Build a few sibling SKUs based on the selected product's base SKU
  const base = product?.sku || "HP-851830-BLK-WRD-000";
  const prefix = base.replace(/-\d{3,}$/, "");
  const skuRows = Array.from({ length: 5 }, (_, i) => {
    const n = String(i + 1).padStart(3, "0");
    return `${prefix}-${n}`;
  });

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Products</h2>
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
          aria-label="Close"
          title="Close"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Body (scrollable) */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Products table */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-gray-100 px-5 py-3 text-sm font-medium text-gray-500">
            <div>SKU</div>
            <div className="text-right">Documents</div>
          </div>

          <ul className="divide-y divide-gray-100">
            {skuRows.map((sku, idx) => (
              <li
                key={sku}
                className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4"
              >
                <div className="truncate text-sm text-gray-900">{sku}</div>

                <div className="flex items-center justify-end gap-2">
                  {/* show 1–3 tiny doc icons */}
                  <DocMini />
                  {idx >= 1 && <DocMini />}
                  {idx >= 2 && <DocMini />}
                  {/* simple +N badge */}
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                    +{idx === 0 ? 0 : 1}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Carrier contact block */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white px-5 py-5">
          <h3 className="text-base font-semibold text-gray-900">
            Carrier’s Contact Information:
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            For shipping delays, please contact your carrier for more
            information.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium text-gray-600">Name</div>
              <div className="mt-1 text-sm text-gray-900">XYZ Logistics</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">
                Contact Number
              </div>
              <div className="mt-1 text-sm text-gray-900">
                +1-555-123-4567
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-sm font-medium text-gray-600">Address</div>
              <div className="mt-1 text-sm text-gray-900">
                456 Commerce Street Los Angeles, CA 90210
              </div>
            </div>
          </div>
        </section>

        {/* Comments */}
        <section className="mt-6">
          <label
            htmlFor="comments"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Comments
          </label>
          <textarea
            id="comments"
            placeholder="Input Comments"
            className="h-28 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </section>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-white px-5 py-4">
        <button className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          Undo All Changes
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          Update Status
          <ChevronDown className="h-4 w-4 opacity-90" />
        </button>
      </div>
    </div>
  );
}

/** Small document placeholder icon */
function DocMini() {
  return (
    <span
      title="Document"
      className="inline-flex h-6 w-5 items-center justify-center rounded border border-gray-200 bg-white shadow-sm"
    >
      <FileText className="h-3.5 w-3.5 text-gray-500" />
    </span>
  );
}
