import React, { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/** Row shape you can fetch from your API */
export type TaskRow = {
  id: string | number;
  type:
    | "HS Code Required"
    | "Discrepancy"
    | "Shipping Delayed"
    | "Custom Delayed"
    | "Missing Information"
    | (string & {}); // allow unknown types too
  sku: string;
  dueDate: string; // e.g. "DD-MM-YYYY"
  stackCount?: number; // the little +5, +6 badge
};

type TasksProps = {
  title?: string;
  rows?: TaskRow[];             // if omitted, component shows built-in mock rows
  page?: number;                // controlled page (1-based). If omitted, component manages its own page
  pageSize?: number;            // default 12
  totalPages?: number;          // set when using server-side pagination
  onPageChange?: (nextPage: number) => void;
  onClose?: () => void;
  onRowClick?: (row: TaskRow) => void;
  className?: string;
};

const mockRows: TaskRow[] = [
  { id: 1,  type: "HS Code Required",  sku: "HP-851830-BLK-WRD-001", dueDate: "DD-MM-YYYY" },
  { id: 2,  type: "Discrepancy",       sku: "HP-851830-BLK-WRD-002", dueDate: "DD-MM-YYYY" },
  { id: 3,  type: "Shipping Delayed",  sku: "HP-851830-BLK-WRD-003", dueDate: "DD-MM-YYYY", stackCount: 5 },
  { id: 4,  type: "Custom Delayed",    sku: "HP-851830-BLK-WRD-004", dueDate: "DD-MM-YYYY", stackCount: 6 },
  { id: 5,  type: "Missing Information", sku: "HP-851830-BLK-WRD-005", dueDate: "DD-MM-YYYY" },
  { id: 6,  type: "Shipping Delayed",  sku: "HP-851830-BLK-WRD-006", dueDate: "DD-MM-YYYY", stackCount: 7 },
  { id: 7,  type: "HS Code Required",  sku: "HP-851830-BLK-WRD-007", dueDate: "DD-MM-YYYY" },
  { id: 8,  type: "Discrepancy",       sku: "HP-851830-BLK-WRD-008", dueDate: "DD-MM-YYYY" },
  { id: 9,  type: "Custom Delayed",    sku: "HP-851830-BLK-WRD-009", dueDate: "DD-MM-YYYY", stackCount: 8 },
  { id: 10, type: "Discrepancy",       sku: "HP-851830-BLK-WRD-010", dueDate: "DD-MM-YYYY", stackCount: 5 },
  { id: 11, type: "HS Code Required",  sku: "HP-851830-BLK-WRD-011", dueDate: "DD-MM-YYYY", stackCount: 4 },
  { id: 12, type: "Discrepancy",       sku: "HP-851830-BLK-WRD-012", dueDate: "DD-MM-YYYY", stackCount: 7 },
  { id: 13, type: "Shipping Delayed",  sku: "HP-851830-BLK-WRD-013", dueDate: "DD-MM-YYYY", stackCount: 5 },
  { id: 14, type: "Custom Delayed",    sku: "HP-851830-BLK-WRD-014", dueDate: "DD-MM-YYYY", stackCount: 4 },
  { id: 15, type: "HS Code Required",  sku: "HP-851830-BLK-WRD-015", dueDate: "DD-MM-YYYY", stackCount: 7 },
];

function typeClasses(type: TaskRow["type"]) {
  // colors tuned to the screenshot feel
  switch (type) {
    case "Shipping Delayed":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "Custom Delayed":
      return "bg-orange-50 text-orange-700 border border-orange-200";
    case "Discrepancy":
      return "bg-white text-gray-700 border border-gray-300";
    case "HS Code Required":
      return "bg-white text-gray-700 border border-gray-300";
    case "Missing Information":
      return "bg-white text-gray-700 border border-gray-300";
    default:
      return "bg-white text-gray-700 border border-gray-300";
  }
}

export default function Tasks({
  title = "Tasks",
  rows,
  page,
  pageSize = 12,
  totalPages,
  onPageChange,
  onClose,
  onRowClick,
  className = "",
}: TasksProps) {
  const controlled = typeof page === "number" && typeof onPageChange === "function";
  const [localPage, setLocalPage] = useState(1);

  const currentPage = controlled ? (page as number) : localPage;

  // If caller didn't give totalPages, we'll compute it from provided rows.
  const allRows = rows && rows.length ? rows : mockRows;
  const derivedTotalPages = Math.max(1, Math.ceil(allRows.length / pageSize));
  const pages = totalPages ?? derivedTotalPages;

  const pageStart = (currentPage - 1) * pageSize;
  const pageRows = useMemo(
    () => (totalPages ? allRows : allRows.slice(pageStart, pageStart + pageSize)),
    // when server-side paginating, assume caller already filtered rows for the current page
    [allRows, pageStart, pageSize, totalPages]
  );

  const go = (p: number) => {
    const clamped = Math.min(Math.max(1, p), pages);
    if (controlled) onPageChange!(clamped);
    else setLocalPage(clamped);
  };

  return (
    <section
      className={`rounded-2xl border bg-white shadow-sm shadow-gray-200 p-4 lg:p-5 ${className}`}
      aria-label={title}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
          aria-label="Close tasks"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50 text-gray-600">
              <tr className="text-left text-sm">
                <th className="w-[220px] px-4 py-3 font-medium">Task Type</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="w-[160px] px-4 py-3 font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className="text-sm hover:bg-gray-50 cursor-default"
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${typeClasses(row.type)}`}>
                      {row.type}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="block max-w-[260px] truncate text-gray-800">
                        {row.sku}
                      </span>
                      {typeof row.stackCount === "number" && row.stackCount > 0 && (
                        <span className="inline-flex h-6 items-center rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-700">
                          +{row.stackCount}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-700">{row.dueDate}</td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                    No tasks to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => go(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        {/* Simple numeric strip like the screenshot: 1 2 … */}
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
