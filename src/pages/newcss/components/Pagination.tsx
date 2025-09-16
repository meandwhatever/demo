import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  /** 1-based current page */
  currentPage: number;
  /** total number of pages (>= 1) */
  pages: number;
  /** called with the next page (1..pages) */
  onChange: (page: number) => void;
  /** how many numeric buttons to show at once (default 5) */
  windowSize?: number;
  className?: string;
};

export default function Pagination({
  currentPage,
  pages,
  onChange,
  windowSize = 5,
  className = "",
}: PaginationProps) {
  const safePages = Math.max(1, Math.floor(pages || 1));
  const safeCurrent = Math.min(Math.max(1, Math.floor(currentPage || 1)), safePages);
  const WINDOW = Math.max(1, Math.floor(windowSize));

  const pageNumbers = useMemo(() => {
    const n = safePages;
    const w = Math.min(WINDOW, n);

    if (n <= w) return Array.from({ length: n }, (_, i) => i + 1);

    // Center current when possible
    const half = Math.floor(w / 2);
    let start = safeCurrent - half;
    let end = safeCurrent + half;

    // for even window sizes, bias so current appears centered-ish
    if (w % 2 === 0) {
      start = safeCurrent - (w / 2 - 1);
      end = safeCurrent + w / 2;
    }

    if (start < 1) {
      start = 1;
      end = w;
    }
    if (end > n) {
      end = n;
      start = n - w + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [safePages, safeCurrent, WINDOW]);

  const showLeftDots = safePages > WINDOW && pageNumbers[0] > 1;
  const showRightDots = safePages > WINDOW && pageNumbers[pageNumbers.length - 1] < safePages;

  const go = (p: number) => onChange(Math.min(Math.max(1, p), safePages));

  return (
    <div className={`mt-4 flex items-center justify-center gap-2 text-sm shrink-0 ${className}`}>
      {/* Start */}
      <button
        type="button"
        onClick={() => go(1)}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
        disabled={safeCurrent <= 1}
        title="First page"
        aria-label="First page"
      >
        Start
      </button>

      {/* Previous */}
      <button
        type="button"
        onClick={() => go(safeCurrent - 1)}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
        disabled={safeCurrent <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      {/* Numeric strip with optional ellipses */}
      <div className="mx-1 inline-flex items-center gap-1">
        {showLeftDots && <span className="px-1 text-gray-500">…</span>}

        {pageNumbers.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => go(n)}
            className={`h-8 w-8 rounded-md ${
              safeCurrent === n ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-800"
            }`}
            aria-current={safeCurrent === n ? "page" : undefined}
          >
            {n}
          </button>
        ))}

        {showRightDots && <span className="px-1 text-gray-500">…</span>}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={() => go(safeCurrent + 1)}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
        disabled={safeCurrent >= safePages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* End */}
      <button
        type="button"
        onClick={() => go(safePages)}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
        disabled={safeCurrent >= safePages}
        title="Last page"
        aria-label="Last page"
      >
        End
      </button>
    </div>
  );
}
