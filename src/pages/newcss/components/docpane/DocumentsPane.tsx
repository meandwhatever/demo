import React from "react";
import type { DocumentRow } from "../documents";
import POPane from "./POPane";
import CLPane from "./CLPane";
import PLPane from "./PLPane";

type Props = {
  document: DocumentRow;
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

export default function DocumentsPane({ document, onClose }: Props) {
  switch (document.docType) {
    case "PO":
        return <POPane document={document} onClose={onClose} />;
    case "Invoice":
      return <CLPane document={document} onClose={onClose} />;
    case "Shipping Label":
      return <PLPane document={document} onClose={onClose} />;
    
    default:
      return <NotFoundPane status={status} onClose={onClose} />;
  }
}
