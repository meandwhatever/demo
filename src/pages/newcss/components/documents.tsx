import React, { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Pagination from "./Pagination";

/** Row shape you can fetch from your API */
export type DocumentRow = {
  id: string | number;
  name: string;                        // e.g., "Invoice.pdf"
  sku: string;                         // e.g., "HP-851830-BLK-001"
  docType: "Invoice" | "PO" | "Shipping Label" | (string & {});
  source: "Email" | "File Upload" | (string & {});
  status: "Missing Information" | "Completed" | "Discrepancy" | (string & {});
  /** for the small +N badge shown near SKU (see screenshot) */
  extraCount?: number;
};

type DocumentsProps = {
  title?: string;
  rows?: DocumentRow[];       // if omitted, shows built-in mock rows
  page?: number;              // controlled page (1-based)
  pageSize?: number;          // default 12
  totalPages?: number;        // set if server-side paginating
  onPageChange?: (nextPage: number) => void;
  onClose?: () => void;
  onRowClick?: (row: DocumentRow) => void;
  className?: string;
  onSearchSubmit?: (query: string) => void;
};

const mockRows: DocumentRow[] = [
  { id: 1,  name: "PO.pdf",            sku: "HP-851830-BLK-001", docType: "PO",        source: "File Upload", status: "Missing Information" },
  { id: 2,  name: "Invoice.pdf",       sku: "HP-851830-BLK-002", docType: "Invoice",        source: "Email",       status: "Completed" },
  { id: 3,  name: "Shippinglabel....", sku: "HP-851830-BLK-003", docType: "Shipping Label", source: "Email",       status: "Missing Information", extraCount: 5 },
  { id: 4,  name: "PO.pdf",            sku: "HP-851830-BLK-004", docType: "PO",             source: "File Upload", status: "Missing Information" },
  { id: 5,  name: "Invoice.pdf",       sku: "HP-851830-BLK-005", docType: "Invoice",        source: "File Upload", status: "Missing Information" },
  { id: 6,  name: "Invoice.pdf",       sku: "HP-851830-BLK-006", docType: "Invoice",        source: "Email",       status: "Completed" },
  { id: 7,  name: "PO.pdf",            sku: "HP-851830-BLK-007", docType: "PO",             source: "File Upload", status: "Discrepancy" },
  { id: 8,  name: "Shippinglabel....", sku: "HP-851830-BLK-008", docType: "Shipping Label", source: "Email",       status: "Completed", extraCount: 5 },
  { id: 9,  name: "Invoice.pdf",       sku: "HP-851830-BLK-009", docType: "PO",             source: "File Upload", status: "Discrepancy" },
  { id: 10, name: "Shippinglabel....", sku: "HP-851830-BLK-010", docType: "Shipping Label", source: "Email",       status: "Missing Information", extraCount: 5 },
  { id: 11, name: "PO.pdf",            sku: "HP-851830-BLK-011", docType: "PO",             source: "File Upload", status: "Discrepancy" },
  { id: 12, name: "Shippinglabel....", sku: "HP-851830-BLK-012", docType: "Shipping Label", source: "Email",       status: "Missing Information", extraCount: 5 },
];

function typePill(t: DocumentRow["docType"]) {
  // neutral, subtle
  return "bg-gray-100 text-gray-800 border border-gray-200";
}
function statusPill(s: DocumentRow["status"]) {
  switch (s) {
    case "Completed":
      return "bg-blue-100 text-blue-700 border border-blue-200";
    case "Discrepancy":
      return "bg-orange-100 text-orange-700 border border-orange-200";
    case "Missing Information":
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
}

export default function Documents({
  title = "All Documents",
  rows,
  page,
  pageSize = 12,
  totalPages,
  onPageChange,
  onClose,
  onRowClick,
  className = "",
  onSearchSubmit,
}: DocumentsProps) {

  const [query, setQuery] = useState("");
  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    onSearchSubmit?.(q);
    setQuery("");
  };



  //pagination
  const [localPage, setLocalPage] = useState(1);
  const currentPage =  localPage;

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
    setLocalPage(clamped);
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
          aria-label="Close documents"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

          {/* 🔎 Search with AI */}
      <form
        onSubmit={(e) => { e.preventDefault(); submitSearch(); }}
        role="search"
        aria-label="Search with AI"
        className="mb-4 shrink-0"
      >
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents with AI"
            className="w-full rounded-xl border border-gray-200 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </form>

      {/* Table */}
      <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 h-full min-h-0">
        <div className="overflow-x-auto min-h-0 overflow-y-auto h-full">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50 text-gray-600">
              <tr className="text-left text-sm">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="w-[190px] px-4 py-3 font-medium">SKU</th>
                <th className="w-[180px] px-4 py-3 font-medium">Type</th>
                <th className="w-[140px] px-4 py-3 font-medium">Source</th>
                <th className="w-[180px] px-4 py-3 font-medium">Statuses</th>
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
                  {/* Name */}
                  <td className="px-4 py-3">
                    <span className="block max-w-[240px] truncate text-gray-800">
                      {row.name}
                    </span>
                  </td>

                  {/* SKU (+N badge) */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="block max-w-[200px] truncate text-gray-800">
                        {row.sku}
                      </span>
                      {typeof row.extraCount === "number" && row.extraCount > 0 && (
                        <span className="inline-flex h-6 items-center rounded-md bg-gray-100 px-2 text-xs font-semibold text-gray-700">
                          +{row.extraCount}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${typePill(row.docType)}`}>
                      {row.docType}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="px-4 py-3">
                    {row.source === "Email" ? (
                      <span className="text-blue-600 hover:underline">Email</span>
                    ) : (
                      <span className="text-gray-800">File Upload</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusPill(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    No documents to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        pages={pages}
        onChange={go}
        windowSize={5}
      />

    </section>
  );
}
