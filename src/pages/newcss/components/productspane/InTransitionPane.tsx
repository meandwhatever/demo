import React from "react";
import { X, ExternalLink } from "lucide-react";
import type { ProductRow } from "../products";

type Props = {
  product: ProductRow;
  onClose: () => void;
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
      {children}
    </span>
  );
}

export default function InTransitionPane({ product, onClose }: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border bg-gray-50 p-4">
      {/* Card header */}
      <div className="mb-3 flex items-start justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
          aria-label="Close details"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Top grid (specs) */}
      <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border bg-white p-5">
        <div className="grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Product Description</p>
            <p className="mt-1 text-gray-900">{product.productDesc}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Quantity</p>
            <p className="mt-1 text-gray-900">3</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Material</p>
            <p className="mt-1 text-gray-900">Plastic</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Weight</p>
            <p className="mt-1 text-gray-900">50g</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Country of Origin</p>
            <p className="mt-1 text-gray-900">China</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Import Country</p>
            <p className="mt-1 text-gray-900">Canada</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Tariffs</p>
            <p className="mt-1 text-gray-900">{product.hsCode}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">HS Code</p>
            <p className="mt-1 text-gray-900">{product.hsCode}</p>
            <button
              className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
              type="button"
            >
              View Justification
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        {/* All Related Documents table */}
        <h3 className="text-sm font-semibold text-gray-900">All Related Documents</h3>

        <div className="mt-3 overflow-hidden rounded-xl border">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 text-gray-600">
              <tr className="text-left text-sm">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="w-[180px] px-4 py-3 font-medium">Document Type</th>
                <th className="w-[180px] px-4 py-3 font-medium">Task Type</th>
                <th className="w-[120px] px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <tr>
                <td className="px-4 py-3">PO.pdf</td>
                <td className="px-4 py-3"><Badge>PO</Badge></td>
                <td className="px-4 py-3"><Badge>Discrepancy</Badge></td>
                <td className="px-4 py-3">
                  <a className="inline-flex items-center gap-1 text-blue-600 hover:underline" href="#">
                    View <ExternalLink className="h-4 w-4" />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Invoice.pdf</td>
                <td className="px-4 py-3"><Badge>Invoice</Badge></td>
                <td className="px-4 py-3"><Badge>Completed</Badge></td>
                <td className="px-4 py-3">
                  <a className="inline-flex items-center gap-1 text-blue-600 hover:underline" href="#">
                    View <ExternalLink className="h-4 w-4" />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Shippinglabel_12345.pdf</td>
                <td className="px-4 py-3"><Badge>Shipping Label</Badge></td>
                <td className="px-4 py-3"><Badge>Missing Information</Badge></td>
                <td className="px-4 py-3">
                  <a className="inline-flex items-center gap-1 text-blue-600 hover:underline" href="#">
                    View <ExternalLink className="h-4 w-4" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
