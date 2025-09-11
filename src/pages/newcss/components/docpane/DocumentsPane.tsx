import React from "react";
import type { DocumentRow } from "../documents";
import DiscrepanciesPane from "./DiscrepanciesPane";
import MissingInformationPane from "./MissingInformationPane";

/** Keep both singular & plural to be safe with upstream data */
export type DocumentStatus =
  | "Missing Information"
  | "Completed"
  | "Discrepancy"
  | "Discrepancies"
  | (string & {});

type Props = {
  document: DocumentRow;
  status: DocumentStatus;
  onClose: () => void;
};

function NotFoundPane({ status, onClose }: { status?: string; onClose: () => void }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="mb-2 text-lg font-semibold">No Pane for “{status || "unknown"}”</div>
      <p className="text-sm text-gray-600">
        Hook up a specific pane for this status or map it here.
      </p>
      <div className="mt-4">
        <button
          onClick={onClose}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          aria-label="Close"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function DocumentsPane({ document, status, onClose }: Props) {
  switch (status) {
    case "Discrepancies":
        return <DiscrepanciesPane document={document} onClose={onClose} />;
    case "Discrepancy":
      return <DiscrepanciesPane document={document} onClose={onClose} />;
    case "Missing Information":
      return <MissingInformationPane document={document} onClose={onClose} />;

    // (Add your other cases later, e.g. Missing Information, Completed, etc.)

    default:
      return <NotFoundPane status={status} onClose={onClose} />;
  }
}
