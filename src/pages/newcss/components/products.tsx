import React, { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/** Row shape you can fetch from your API */
export type ProductRow = {
  id: string | number;
  sku: string;
  productDesc: string;
  shippingStatus:
    | "PO Submitted"
    | "In Transition"
    | "Shipping Delayed"
    | "In Custom"
    | "Custom Delayed"
    | "Received"
    | (string & {}); // allow unknown types
  hsCode: string;
  /** number of *extra* docs beyond the shown thumbnails */
  extraDocs?: number;
  /** how many small doc thumbnails to render (0-3 typical) */
  docThumbs?: number;
};

type ProductsProps = {
  title?: string;
  rows?: ProductRow[];          // if omitted, shows built-in mock rows
  page?: number;                // controlled page (1-based)
  pageSize?: number;            // default 12
  totalPages?: number;          // set if server-side paginating
  onPageChange?: (nextPage: number) => void;
  onClose?: () => void;
  onRowClick?: (row: ProductRow) => void;
  className?: string;
};

const mockRows: ProductRow[] = [
  { id: 1,  sku: "HP-851830-BLK-001", productDesc: "Black, Over-ear Headphones", shippingStatus: "PO Submitted",   hsCode: "8471.30", docThumbs: 3, extraDocs: 0 },
  { id: 2,  sku: "HP-851830-WHT-002", productDesc: "White, Over-ear Headphones", shippingStatus: "In Transition",   hsCode: "8518.30", docThumbs: 3, extraDocs: 0 },
  { id: 3,  sku: "HP-851830-SLV-003", productDesc: "Silver, Over-ear Headphones", shippingStatus: "Shipping Delayed",hsCode: "8517.62", docThumbs: 2, extraDocs: 2 },
  { id: 4,  sku: "HP-851830-GLD-004", productDesc: "Gold, Over-ear Headphones",  shippingStatus: "In Custom",       hsCode: "8471.30", docThumbs: 2, extraDocs: 1 },
  { id: 5,  sku: "HP-851830-PNK-005", productDesc: "Pink, Over-ear Headphones",  shippingStatus: "Custom Delayed",  hsCode: "8471.30", docThumbs: 2, extraDocs: 1 },
  { id: 6,  sku: "HP-851830-ORG-006", productDesc: "Orange, Over-ear Headphones",shippingStatus: "Received",        hsCode: "8471.30", docThumbs: 2, extraDocs: 1 },
  { id: 7,  sku: "HP-851830-YLW-007", productDesc: "Yellow, Over-ear Headphones",shippingStatus: "In Transition",   hsCode: "8471.30", docThumbs: 1, extraDocs: 0 },
  { id: 8,  sku: "HP-851830-RED-008", productDesc: "Red, Over-ear Headphones",   shippingStatus: "Shipping Delayed",hsCode: "8471.30", docThumbs: 1, extraDocs: 2 },
  { id: 9,  sku: "HP-851830-BLU-009", productDesc: "Blue, Over-ear Headphones",  shippingStatus: "Received",        hsCode: "8471.30", docThumbs: 2, extraDocs: 1 },
  { id: 10, sku: "HP-851830-GRY-010", productDesc: "Grey, Over-ear Headphones",  shippingStatus: "Custom Delayed",  hsCode: "8471.30", docThumbs: 2, extraDocs: 1 },
  { id: 11, sku: "HP-851830-GRN-011", productDesc: "Green, Over-ear Headphones", shippingStatus: "PO Submitted",    hsCode: "8471.30", docThumbs: 3, extraDocs: 3 },
  { id: 12, sku: "HP-851830-VLT-012", productDesc: "Violet, Over-ear Headphones",shippingStatus: "Custom Delayed",  hsCode: "8471.30", docThumbs: 2, extraDocs: 1 },
  { id: 13, sku: "HP-851830-MRN-013", productDesc: "Maroon, Over-ear Headphones",shippingStatus: "Received",        hsCode: "8471.30", docThumbs: 2, extraDocs: 4 },
  { id: 14, sku: "HP-851830-RED-014", productDesc: "Red, Over-ear Headphones",   shippingStatus: "Shipping Delayed",hsCode: "8471.30", docThumbs: 1, extraDocs: 1 },
  { id: 15, sku: "HP-851830-YLW-015", productDesc: "Yellow, Over-ear Headphones",shippingStatus: "Received",        hsCode: "8471.30", docThumbs: 2, extraDocs: 1 },
];

function statusPill(status: ProductRow["shippingStatus"]) {
  switch (status) {
    case "PO Submitted":
      return "bg-blue-100 text-blue-700 border border-blue-200";
    case "In Transition":
      return "bg-gray-100 text-gray-700 border border-gray-200";
    case "In Custom":
      return "bg-gray-100 text-gray-700 border border-gray-200";
    case "Shipping Delayed":
      return "bg-red-100 text-red-700 border border-red-200";
    case "Custom Delayed":
      return "bg-orange-100 text-orange-700 border border-orange-200";
    case "Received":
      return "bg-green-100 text-green-700 border border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
}

function DocIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}

export default function Products({
  title = "All Products",
  rows,
  page,
  pageSize = 12,
  totalPages,
  onPageChange,
  onClose,
  onRowClick,
  className = "",
}: ProductsProps) {
  const controlled = typeof page === "number" && typeof onPageChange === "function";
  const [localPage, setLocalPage] = useState(1);

  const currentPage = controlled ? (page as number) : localPage;

  const allRows = rows && rows.length ? rows : mockRows;
  const derivedTotalPages = Math.max(1, Math.ceil(allRows.length / pageSize));
  const pages = totalPages ?? derivedTotalPages;

  const pageStart = (currentPage - 1) * pageSize;
  const pageRows = useMemo(
    () => (totalPages ? allRows : allRows.slice(pageStart, pageStart + pageSize)),
    [allRows, pageStart, pageSize, totalPages]
  );

  const go = (p: number) => {
    const clamped = Math.min(Math.max(1, p), pages);
    if (controlled) onPageChange!(clamped);
    else setLocalPage(clamped);
  };

  return (
    <section
      className={`flex h-full min-h-0 flex-col rounded-2xl border bg-white shadow-sm shadow-gray-200 p-4 lg:p-5 ${className}`}
      aria-label={title}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
          aria-label="Close products"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 h-full min-h-0">
        <div className="overflow-x-auto min-h-0 overflow-y-auto h-full">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50 text-gray-600">
              <tr className="text-left text-sm">
                <th className="w-[190px] px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Product Desc…</th>
                <th className="w-[180px] px-4 py-3 font-medium">Shipping Status</th>
                <th className="w-[120px] px-4 py-3 font-medium">HS Code</th>
                <th className="w-[160px] px-4 py-3 font-medium">Documents</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {pageRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className="text-sm hover:bg-gray-50 cursor-pointer"
                  role="button"
                  tabIndex={0}
                >
                  {/* SKU */}
                  <td className="px-4 py-3">
                    <span className="block max-w-[220px] truncate text-gray-800">
                      {row.sku}
                    </span>
                  </td>

                  {/* Product Desc */}
                  <td className="px-4 py-3">
                    <span className="block max-w-[340px] truncate text-gray-800">
                      {row.productDesc}
                    </span>
                  </td>

                  {/* Shipping Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusPill(row.shippingStatus)}`}>
                      {row.shippingStatus}
                    </span>
                  </td>

                  {/* HS Code */}
                  <td className="px-4 py-3">
                    <span className="text-blue-600 hover:underline">{row.hsCode}</span>
                  </td>

                  {/* Documents */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        {Array.from({ length: Math.max(0, Math.min(3, row.docThumbs ?? 0)) }).map((_, idx) => (
                          <span key={idx} className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-300 bg-white">
                            <DocIcon />
                          </span>
                        ))}
                      </div>
                      {typeof row.extraDocs === "number" && row.extraDocs > 0 && (
                        <span className="inline-flex h-7 items-center rounded-md bg-gray-100 px-2 text-xs font-semibold text-gray-700">
                          +{row.extraDocs}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    No products to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm shrink-0">
        <button
          type="button"
          onClick={() => go(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="mx-1 inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(1)}
            className={`h-8 w-8 rounded-md ${currentPage === 1 ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-800"}`}
          >
            1
          </button>
          {pages >= 2 && (
            <button
              type="button"
              onClick={() => go(2)}
              className={`h-8 w-8 rounded-md ${currentPage === 2 ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-800"}`}
            >
              2
            </button>
          )}
          {pages > 2 && <span className="px-1 text-gray-500">…</span>}
        </div>

        <button
          type="button"
          onClick={() => go(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
          disabled={currentPage >= pages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
