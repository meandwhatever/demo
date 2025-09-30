import React, { useMemo, useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import Pagination from "./Pagination";



/** Row shape you can fetch from your API */
export type TaskRow = {
  id: string | number;
  type:
    | "Review and Appove HS Code"
    | "Resolve Document Discrepancy"
    | "Resolve Shipment Delay"
    | "Custom Delayed"
    | "Input Missing SKU Number"
    | (string & {}); // allow unknown types too
  poNumber: string;           // 4-digit, kept as string so we can have leading zeros if needed
  status: "Open" | "Completed";
  dueDate: string;            // e.g. "DD-MM-YYYY"
  stackCount?: number;        // the little +5, +6 badge (kept; shown next to PO)
};

type TasksProps = {
  title?: string;
  rows?: TaskRow[];           // if omitted, component shows built-in mock rows
  page?: number;              // controlled page (1-based). If omitted, component manages its own page
  pageSize?: number;          // default
  totalPages?: number;        // set when using server-side pagination
  onPageChange?: (nextPage: number) => void;
  onClose?: () => void;
  onRowClick?: (row: TaskRow) => void;
  className?: string;
  onSearchSubmit?: (query: string) => void;
};

const mockRows: TaskRow[] = [
  { id: 1,  type: "Review and Appove HS Code",   poNumber: "5241", status: "Open",       dueDate: "DD-MM-YYYY" },
  { id: 2,  type: "Resolve Document Discrepancy",        poNumber: "6574", status: "Open",       dueDate: "DD-MM-YYYY" },
  { id: 3,  type: "Resolve Shipment Delay",   poNumber: "3571", status: "Open",  dueDate: "DD-MM-YYYY" },
  { id: 4,  type: "Custom Delayed",     poNumber: "8564", status: "Open",       dueDate: "DD-MM-YYYY",  },
  { id: 5,  type: "Input Missing SKU Number",poNumber: "9872", status: "Open",  dueDate: "DD-MM-YYYY" },
  { id: 6,  type: "Resolve Shipment Delay",   poNumber: "5487", status: "Open",  dueDate: "DD-MM-YYYY",  },
  { id: 7,  type: "Review and Appove HS Code",   poNumber: "6547", status: "Open",       dueDate: "DD-MM-YYYY" },
  { id: 8,  type: "Resolve Document Discrepancy",        poNumber: "8795", status: "Open",       dueDate: "DD-MM-YYYY" },
  { id: 9,  type: "Custom Delayed",     poNumber: "7213", status: "Open",       dueDate: "DD-MM-YYYY",  },
  { id:10,  type: "Resolve Document Discrepancy",        poNumber: "2314", status: "Open",  dueDate: "DD-MM-YYYY",  },
  { id:11,  type: "HS Code Required",   poNumber: "6542", status: "Open",       dueDate: "DD-MM-YYYY",  },
  { id:12,  type: "Resolve Document Discrepancy",        poNumber: "9874", status: "Open",       dueDate: "DD-MM-YYYY",  },
  { id:13,  type: "Resolve Shipment Delay",   poNumber: "3245", status: "Open",  dueDate: "DD-MM-YYYY",  },
  { id:14,  type: "Custom Delayed",     poNumber: "6547", status: "Open",       dueDate: "DD-MM-YYYY",  },
  { id:15,  type: "HS Code Required",   poNumber: "2145", status: "Open",       dueDate: "DD-MM-YYYY",  },
];

function typeClasses(type: TaskRow["type"]) {
  // colors tuned to the original screenshot feel
  switch (type) {
    case "Shipping Delayed":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "Custom Delayed":
      return "bg-orange-50 text-orange-700 border border-orange-200";
    case "Discrepancy":
    case "HS Code Required":
    case "Missing Information":
    default:
      return "bg-white text-gray-700 border border-gray-300";
  }
}

function statusPillClasses(status: TaskRow["status"]) {
  return status === "Completed"
    ? "bg-green-100 text-green-700 ring-1 ring-inset ring-green-200"
    : "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200";
}

export default function Tasks({
  title = "Tasks",
  rows,
  page,
  pageSize = 9,
  totalPages,
  onPageChange,
  onClose,
  onRowClick,
  className = "",
  onSearchSubmit,
}: TasksProps) {
  const [query, setQuery] = useState("");

  const submitSearch = () => {
  const q = query.trim();
  if (!q) return;
  onSearchSubmit?.(q); // parent opens chat and sends the message
  setQuery("");
  };


  // pagination
  const [localPage, setLocalPage] = useState(1);
  const currentPage = localPage;


    // NEW: fetch from API and override mockRows when available
    const [serverRows, setServerRows] = useState<TaskRow[] | null>(null);
    useEffect(() => {
      let cancelled = false;
      (async () => {
        try {
          const res = await fetch("/api/newcss/task/task");
          const json = await res.json();
          if (!cancelled) setServerRows(json.tasks as TaskRow[]);
        } catch (e) {
          console.error("Failed to fetch tasks", e);
        }
      })();
      return () => { cancelled = true; };
    }, []);
  

  const allRows =serverRows || mockRows;
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
          aria-label="Close tasks"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
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
            placeholder="Search with AI"
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
                <th className="w-[240px] px-4 py-3 font-medium">Task Type</th>
                <th className="w-[140px] px-4 py-3 font-medium">PO Number</th>
                <th className="w-[140px] px-4 py-3 font-medium">Task Status</th>
                <th className="w-[160px] px-4 py-3 font-medium">Due Date</th>
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
                  {/* Task Type */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${typeClasses(row.type)}`}>
                      {row.type}
                    </span>
                  </td>

                  {/* PO Number (4-digit) + optional stack badge */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums text-gray-800 font-medium">{row.poNumber}</span>
                      {typeof row.stackCount === "number" && row.stackCount > 0 && (
                        <span className="inline-flex h-6 items-center rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-700">
                          +{row.stackCount}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Task Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusPillClasses(row.status)}`}>
                      {row.status}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="px-4 py-3 text-gray-700">{row.dueDate}</td>
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                    No tasks to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={currentPage} pages={pages} onChange={go} windowSize={5} />
    </section>
  );
}
