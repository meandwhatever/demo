import React, { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import HSJustificationModal from "./HSJustificationModal";

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="truncate text-sm text-gray-900">{children}</div>
    </div>
  );
}

export default function SKUPane() {
  const sku = "HEDD-TWO-GT";
  const desc = "HEDDphone TWO GT";
  const qty = 10;
  const material = "Plastic";
  const weight = "50g";
  const origin = "China";
  const importCountry = "Europe";
  const tariffs = "847";
  const hsCode = "8518302000";
  const docs = useMemo(
    () => [
      { name: "Po.pdf", type: "PO", task: "Resolve Document Discrepancies" },
      { name: "Invoice.pdf", type: "CI", task: "Review and Approve HS Code" },
      { name: "Shippinglabel.pdf", type: "Shipping Label", task: "Resolve Shipment Delay" },
    ],
    []
  );

  const [showJust, setShowJust] = useState(false);

  return (
    <section className="mb-4 flex h-full min-h-0 flex-col rounded-2xl border bg-white shadow-sm">
      {/* Header */}
      <header className="border-b p-3">
        <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
      </header>

      {/* Body (scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {/* Product */}
          <section className="p-4">
            <div className="mb-3 text-sm font-semibold text-gray-800">Product</div>

            <div className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <Labeled label="SKU Number">{sku}</Labeled>
              <Labeled label="Product Description">{desc}</Labeled>

              <Labeled label="Quantity">{qty}</Labeled>
              <Labeled label="Material">{material}</Labeled>
              <Labeled label="Weight">{weight}</Labeled>

              <Labeled label="Country of Origin">{origin}</Labeled>
              <Labeled label="Import Country">{importCountry}</Labeled>
              <Labeled label="Tariffs">{tariffs}</Labeled>

              <div className="sm:col-span-2 lg:col-span-3">
                <Labeled label="HS Code">
                  <div className="space-y-1">
                    <div className="text-base font-medium text-gray-900">{hsCode}</div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                      onClick={() => setShowJust(true)}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Justification</span>
                    </button>
                  </div>
                </Labeled>
              </div>
            </div>
          </section>

          {/* All Related Documents */}
          <section className="p-4 pb-6">
            <div className="mb-3 text-sm font-semibold text-gray-800">All Related Documents</div>
            <div className="overflow-x-auto">
              <table className="min-w-[780px] table-fixed">
                <thead className="bg-gray-50 text-gray-700">
                  <tr className="text-left text-sm">
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="w-[180px] px-4 py-2 font-medium">Document Type</th>
                    <th className="w-[320px] px-4 py-2 font-medium">Open Task</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {docs.map((d) => (
                    <tr key={d.name}>
                      <td className="px-4 py-2">
                        <a href="#" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                          <ExternalLink className="h-4 w-4" />
                          {d.name}
                        </a>
                      </td>
                      <td className="px-4 py-2">
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                          {d.type}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                          {d.task}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* Modal */}
      <HSJustificationModal open={showJust} onClose={() => setShowJust(false)} />
    </section>
  );
}
