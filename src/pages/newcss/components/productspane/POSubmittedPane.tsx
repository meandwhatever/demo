// productspane/POSubmittedPane.tsx
import React from "react";
import { X, ExternalLink } from "lucide-react";
import type { ProductRow } from "../products";

type Props = {
  product: ProductRow;
  onClose: () => void;
};

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="truncate text-sm text-gray-900">{children}</div>
    </div>
  );
}

export default function POSubmittedPane({ product, onClose }: Props) {
  // mock numbers to mirror the screenshot
  const unitCost = "EUR 1,099.50";
  const qty = 10;
  const lineTotal = "EUR 1,099.50";

  return (
    <section className="flex h-full min-h-0 flex-col rounded-2xl border bg-white shadow-sm shadow-gray-200">
      {/* Header */}
      <header className="flex items-center justify-between rounded-t-2xl border-b p-3">
        <h2 className="text-lg font-semibold text-gray-900">Purchase Order Details</h2>
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
          aria-label="Close pane"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Body (scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Use soft separators between sections */}
        <div className="divide-y divide-gray-200">
          {/* Shipping To */}
          <section className="p-3">
            <div className="mb-3 text-sm font-semibold text-gray-800">Shipping To</div>
            <div className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              <Labeled label="Company">Headphones.com</Labeled>
              <Labeled label="Address">4210 B St NW, Suite J</Labeled>
              <Labeled label="City">Auburn</Labeled>
              <Labeled label="State">WA</Labeled>
              <Labeled label="ZIP Code">98001</Labeled>
              <Labeled label="Phone Number">913-568-8463</Labeled>
            </div>
          </section>

          {/* Order Information */}
          <section className="p-3">
            <div className="mb-3 text-sm font-semibold text-gray-800">Order Information</div>
            <div className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              <Labeled label="Order Number">1554</Labeled>
              <Labeled label="Issue Date">05/07/2025</Labeled>
              <Labeled label="Expected By">05/21/2025</Labeled>
              <Labeled label="Vendor">HEDD Audio GmbH</Labeled>
              <Labeled label="Currency">EUR</Labeled>
              <Labeled label="Payment Terms">Net 30 with 50% deposit</Labeled>
            </div>
          </section>

          {/* Products (H-scrollable) */}
          <section className="p-3">
            <div className="mb-3 text-sm font-semibold text-gray-800">Products</div>
            <div className="overflow-x-auto">
              <table className="min-w-[820px] table-fixed">
                <thead className="bg-gray-50 text-gray-700">
                  <tr className="text-left text-sm">
                    <th className="w-[200px] px-4 py-2 font-medium">SKU</th>
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="w-[140px] px-4 py-2 font-medium">HS Code</th>
                    <th className="w-[140px] px-4 py-2 font-medium">Unit Cost</th>
                    <th className="w-[90px] px-4 py-2 font-medium">Qty</th>
                    <th className="w-[160px] px-4 py-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  <tr>
                    <td className="px-4 py-2">
                      <a
                        href="#"
                        className="inline-flex items-center gap-1 truncate text-blue-600 hover:underline"
                        title={product.sku}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="truncate">{product.sku}</span>
                      </a>
                    </td>
                    <td className="px-4 py-2">
                      <span className="block max-w-[360px] truncate text-gray-900">
                        {product.productDesc || "HEDDphones"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-gray-900">{product.hsCode || "8518.30.20"}</span>
                    </td>
                    <td className="px-4 py-2">{unitCost}</td>
                    <td className="px-4 py-2">{qty}</td>
                    <td className="px-4 py-2">{lineTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Pricing Summary */}
          <section className="p-3">
            <div className="mb-3 text-sm font-semibold text-gray-800">Pricing Summary</div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Labeled label="Subtotal">EUR 1,099.50</Labeled>
              <Labeled label="Sales Tax">EUR 0</Labeled>
              <Labeled label="Shipping and Handling">EUR 0</Labeled>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium text-gray-500">Total</div>
              <div className="text-base font-semibold text-gray-900">EUR 1,099.50</div>
            </div>
          </section>

          {/* All Related Documents (H-scrollable) */}
          <section className="p-3">
            <div className="mb-3 text-sm font-semibold text-gray-800">All Related Documents</div>
            <div className="overflow-x-auto">
              <table className="min-w-[780px] table-fixed">
                <thead className="bg-gray-50 text-gray-700">
                  <tr className="text-left text-sm">
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="w-[180px] px-4 py-2 font-medium">Document Type</th>
                    <th className="w-[280px] px-4 py-2 font-medium">Open Task</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  <tr>
                    <td className="px-4 py-2">
                      <a href="#" className="text-blue-600 hover:underline">Po.pdf</a>
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                        PO
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                        Resolve Document Discrepancies
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">
                      <a href="#" className="text-blue-600 hover:underline">Invoice.pdf</a>
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                        CI
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                        Review and Approve HS Code
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">
                      <a href="#" className="text-blue-600 hover:underline">Shippinglabel.pdf</a>
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                        Shipping Label
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                        Resolve Shipment Delay
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
