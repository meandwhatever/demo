import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, X } from "lucide-react";
import type { DocumentRow } from "../documents";

type Props = {
  document: DocumentRow;
  onClose: () => void;
};

// Mock PO data builder (uses a bit of info from the row, fills the rest)
function buildPOData(doc: DocumentRow) {
  return {
    shippingTo: {
      company: "Headphones.com",
      address: "4210 B St NW, Suite J",
      city: "Auburn",
      state: "WA",
      zip: "98001",
      phone: "913-568-8463",
    },
    orderInfo: {
      orderNumber: "1554",
      issueDate: "05/07/2025",
      expectedBy: "05/21/2025",
      vendor: "HEDD Audio GmbH",
      currency: "EUR",
      terms: "Net 30 with 50% deposit",
    },
    products: [
      {
        sku: doc.sku || "HEDD-TWO-",
        name: "HEDDphone TWO",
        hsCode: "8518.30.20",
        unitCost: "EUR 1,099.50",
        qty: 10,
        total: "EUR 1,099.50",
      },
    ],
    pricing: {
      subtotal: "EUR 1,099.50",
      tax: "EUR 0",
      shipping: "EUR 0",
      total: "EUR 1,099.50",
    },
  };
}

function Section({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
          aria-label={isOpen ? `Collapse ${title}` : `Expand ${title}`}
          title={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

export default function POPane({ document, onClose }: Props) {
  const data = useMemo(() => buildPOData(document), [document]);

  const [openShip, setOpenShip] = useState(true);
  const [openOrder, setOpenOrder] = useState(true);
  const [openProducts, setOpenProducts] = useState(true);
  const [openPricing, setOpenPricing] = useState(true);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-2xl bg-white p-3">
      {/* Header */}
      <header className="mb-2 flex items-start justify-between">
        <h2 className="text-xl font-semibold text-gray-900">PO Digitised Fields</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          title="Close"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Body (vertical scroll) */}
      <div className="flex-1 overflow-y-auto">
        {/* Shipping To */}
        <Section title="Shipping To" isOpen={openShip} onToggle={() => setOpenShip((v) => !v)}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-gray-500">Company</div>
              <div className="text-gray-900">{data.shippingTo.company}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Address</div>
              <div className="text-gray-900">{data.shippingTo.address}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">City</div>
              <div className="text-gray-900">{data.shippingTo.city}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">State</div>
              <div className="text-gray-900">{data.shippingTo.state}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">ZIP Code</div>
              <div className="text-gray-900">{data.shippingTo.zip}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Phone Number</div>
              <div className="text-gray-900">{data.shippingTo.phone}</div>
            </div>
          </div>
        </Section>

        {/* Order Information */}
        <Section
          title="Order Information"
          isOpen={openOrder}
          onToggle={() => setOpenOrder((v) => !v)}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-gray-500">Order Number</div>
              <div className="text-gray-900">{data.orderInfo.orderNumber}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Issue Date</div>
              <div className="text-gray-900">{data.orderInfo.issueDate}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Expected By</div>
              <div className="text-gray-900">{data.orderInfo.expectedBy}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Vendor</div>
              <div className="text-gray-900">{data.orderInfo.vendor}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Currency</div>
              <div className="text-gray-900">{data.orderInfo.currency}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Payment Terms</div>
              <div className="text-gray-900">{data.orderInfo.terms}</div>
            </div>
          </div>
        </Section>

        {/* Products (horizontal scroll) */}
        <Section title="Products" isOpen={openProducts} onToggle={() => setOpenProducts((v) => !v)}>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-[900px] table-fixed">
              <thead className="bg-gray-50 text-left text-sm text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="w-[220px] px-4 py-3 font-medium">Name</th>
                  <th className="w-[140px] px-4 py-3 font-medium">HS Code</th>
                  <th className="w-[160px] px-4 py-3 font-medium">Unit Cost</th>
                  <th className="w-[80px] px-4 py-3 font-medium">Qty</th>
                  <th className="w-[160px] px-4 py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {data.products.map((p, i) => (
                  <tr key={i} className="text-gray-900">
                    <td className="px-4 py-3">
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {p.sku}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block max-w-[220px] truncate">{p.name}</span>
                    </td>
                    <td className="px-4 py-3">{p.hsCode}</td>
                    <td className="px-4 py-3">{p.unitCost}</td>
                    <td className="px-4 py-3">{p.qty}</td>
                    <td className="px-4 py-3">{p.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Pricing Summary */}
        <Section
          title="Pricing Summary"
          isOpen={openPricing}
          onToggle={() => setOpenPricing((v) => !v)}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-gray-500">Subtotal</div>
              <div className="text-gray-900">{data.pricing.subtotal}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Sales Tax</div>
              <div className="text-gray-900">{data.pricing.tax}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Shipping and Handling</div>
              <div className="text-gray-900">{data.pricing.shipping}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Total</div>
              <div className="text-gray-900">{data.pricing.total}</div>
            </div>
          </div>
        </Section>
      </div>
    </section>
  );
}
