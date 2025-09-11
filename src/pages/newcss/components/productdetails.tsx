import React, { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Upload } from "lucide-react";
import type { ProductRow } from "./products";
import DocPane from "./taskpane/docpane"; // re-use existing DocPane
import ProductsPane from "./productspane/ProductsPane";

type Props = {
  product: ProductRow;
  onBack: () => void;
  docUrl?: string;
};

export default function ProductDetails({ product, onBack, docUrl }: Props) {
  const [showDocPane, setShowDocPane] = useState(true);
  const [showRightPane, setShowRightPane] = useState(true);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl bg-white shadow-sm shadow-gray-200">
      {/* Header */}
      <header className="flex items-start rounded-t-2xl bg-white p-2">
        <div className="w-full">
          {/* Row 1: Back + Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-gray-50"
              aria-label="Back"
              title="Back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>

            <h1 className="text-xl font-semibold text-gray-900">
              {product.shippingStatus || "Product Details"}
            </h1>
          </div>

          {/* Row 2: Metadata (SKU / ETA / Shipment / Delivery) */}
          <div className="mt-2 grid grid-cols-1 gap-x-8 gap-y-1 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
            <p>
              <span className="font-medium">SKU Number:</span>{" "}
              <span className="text-gray-900">{product.sku}</span>
            </p>
            <p>
              <span className="font-medium">ETA:</span>{" "}
              <span className="text-gray-800">DD-MM-YYYY</span>
            </p>
            <p>
              <span className="font-medium">Shipment ID:</span>{" "}
              <a className="text-blue-600 hover:underline" href="#">SH-001</a>
            </p>
            <p>
              <span className="font-medium">Place of Delivery:</span>{" "}
              <span className="text-gray-800">Warehouse A</span>
            </p>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="relative grid flex-1 min-h-0 grid-cols-1 gap-2 p-2 lg:grid-cols-12 bg-white">
        {/* Re-open: LEFT */}
        {!showDocPane && (
          <button
            onClick={() => setShowDocPane(true)}
            className="absolute left-0 -top-3 z-10 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
            title="Show uploaded document"
            aria-label="Show uploaded document"
          >
            <Upload className="h-4 w-4" />
            Related Docs
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Re-open: RIGHT */}
        {!showRightPane && (
          <button
            onClick={() => setShowRightPane(true)}
            className="absolute right-0 -top-3 z-10 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
            title="Show product pane"
            aria-label="Show product pane"
          >
            <FileText className="h-4 w-4" />
            Product Details
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* Left: Related Documents (reusing DocPane UI) */}
        {showDocPane && (
          <aside className={`min-h-0 ${showRightPane ? "lg:col-span-4" : "lg:col-span-12"}`}>
            <DocPane docUrl={docUrl} onClose={() => setShowDocPane(false)} />
          </aside>
        )}

        {/* Right: Products dynamic pane (switch by Shipping Status) */}
        {showRightPane && (
          <section className={`min-h-0 ${showDocPane ? "lg:col-span-8" : "lg:col-span-12"}`}>
            <ProductsPane
              shippingStatus={product.shippingStatus}
              product={product}
              onClose={() => setShowRightPane(false)}
            />
          </section>
        )}
      </div>
    </div>
  );
}
