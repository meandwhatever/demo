import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import type { DocumentRow } from "../documents";

type Props = {
  document: DocumentRow;
  onClose: () => void;
};

function buildPLData(doc: DocumentRow) {
  return {
    orderInfo: {
      orderNo: "62193",
      orderDate: "7/28/2025",
      refNumber: "HP-072825-Aperio-Return",
      vendorNo: "-",
    },
    customerInfo: {
      customerNo: "1",
      custPO: "-",
      shippedVia: "-",
      mode: "-",
    },
    shippingTo: {
      company: "Warwick Acoustics",
      address: "MIRA Technology Park - Unit 3, NW07, Watling Street",
      city: "Nuneaton",
      zip: "CV10 0TU",
      country: "GB",
    },
    billTo: {
      company: "Warwick Acoustics",
      address: "MIRA Technology Park - Unit 3, NW07, Watling Street",
      city: "Nuneaton",
      zip: "CV10 0TU",
      country: "GB",
    },
    products: [
      {
        sku: (doc.sku as string) || "WARWICK-APER...",
        description: "Warwick Acoustics…",
        quantity: "4.00",
        unit: "Each",
        dimQty: "4.00",
        dimUom: "Each",
        cuFt: "-",
        lbs: "236.00",
      },
      {
        sku: "WARWICK-APER...",
        description: "Warwick Acoustics…",
        quantity: "6.00",
        unit: "Each",
        dimQty: "6.00",
        dimUom: "Each",
        cuFt: "-",
        lbs: "354.00",
      },
    ],
    totals: {
      quantity: "10.00",
      dimQty: "10.00",
      lbs: "590.00",
    },
    notes: "NIL",
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
        >
          {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

export default function PLPane({ document, onClose }: Props) {
  const data = useMemo(() => buildPLData(document), [document]);

  const [openOrder, setOpenOrder] = useState(true);
  const [openCustomer, setOpenCustomer] = useState(true);
  const [openShipTo, setOpenShipTo] = useState(true);
  const [openBillTo, setOpenBillTo] = useState(true);
  const [openProducts, setOpenProducts] = useState(true);
  const [openNotes, setOpenNotes] = useState(true);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-2xl bg-white p-3">
      {/* Header */}
      <header className="mb-2 flex items-start justify-between">
        <h2 className="text-xl font-semibold text-gray-900">PL Digitised Fields</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Order Information */}
        <Section title="Order Information" isOpen={openOrder} onToggle={() => setOpenOrder(v => !v)}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-gray-500">Order#</div>
              <div className="text-gray-900">{data.orderInfo.orderNo}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Order Date</div>
              <div className="text-gray-900">{data.orderInfo.orderDate}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Ref. Number</div>
              <div className="text-gray-900">{data.orderInfo.refNumber}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Vendor #</div>
              <div className="text-gray-900">{data.orderInfo.vendorNo}</div>
            </div>
          </div>
        </Section>

        {/* Customer Information */}
        <Section
          title="Customer Information"
          isOpen={openCustomer}
          onToggle={() => setOpenCustomer(v => !v)}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-4">
            <div>
              <div className="text-sm text-gray-500">Customer#</div>
              <div className="text-gray-900">{data.customerInfo.customerNo}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">CustPO#</div>
              <div className="text-gray-900">{data.customerInfo.custPO}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Shipped Via</div>
              <div className="text-gray-900">{data.customerInfo.shippedVia}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Mode</div>
              <div className="text-gray-900">{data.customerInfo.mode}</div>
            </div>
          </div>
        </Section>

        {/* Shipping To */}
        <Section title="Shipping To" isOpen={openShipTo} onToggle={() => setOpenShipTo(v => !v)}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-gray-500">Company</div>
              <div className="text-gray-900">{data.shippingTo.company}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-sm text-gray-500">Address</div>
              <div className="text-gray-900">{data.shippingTo.address}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">City</div>
              <div className="text-gray-900">{data.shippingTo.city}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">ZIP Code</div>
              <div className="text-gray-900">{data.shippingTo.zip}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Country</div>
              <div className="text-gray-900">{data.shippingTo.country}</div>
            </div>
          </div>
        </Section>

        {/* Bill To */}
        <Section title="Bill To" isOpen={openBillTo} onToggle={() => setOpenBillTo(v => !v)}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-gray-500">Company</div>
              <div className="text-gray-900">{data.billTo.company}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-sm text-gray-500">Address</div>
              <div className="text-gray-900">{data.billTo.address}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">City</div>
              <div className="text-gray-900">{data.billTo.city}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">ZIP Code</div>
              <div className="text-gray-900">{data.billTo.zip}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Country</div>
              <div className="text-gray-900">{data.billTo.country}</div>
            </div>
          </div>
        </Section>

        {/* Products (HORIZONTAL SCROLL) */}
        <Section title="Products" isOpen={openProducts} onToggle={() => setOpenProducts(v => !v)}>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-[1000px] table-fixed">
              <thead className="bg-gray-50 text-left text-sm text-gray-600">
                <tr>
                  <th className="w-[180px] px-4 py-3 font-medium">SKU</th>
                  <th className="w-[260px] px-4 py-3 font-medium">Description</th>
                  <th className="w-[120px] px-4 py-3 font-medium">Quantity</th>
                  <th className="w-[100px] px-4 py-3 font-medium">Unit</th>
                  <th className="w-[120px] px-4 py-3 font-medium">Dim. Qty</th>
                  <th className="w-[120px] px-4 py-3 font-medium">Dim. UOM</th>
                  <th className="w-[120px] px-4 py-3 font-medium">Cu Ft</th>
                  <th className="w-[120px] px-4 py-3 font-medium">Lbs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-900">
                {data.products.map((p, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <span className="block max-w-[180px] truncate">{p.sku}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block max-w-[260px] truncate">{p.description}</span>
                    </td>
                    <td className="px-4 py-3">{p.quantity}</td>
                    <td className="px-4 py-3">{p.unit}</td>
                    <td className="px-4 py-3">{p.dimQty}</td>
                    <td className="px-4 py-3">{p.dimUom}</td>
                    <td className="px-4 py-3">{p.cuFt}</td>
                    <td className="px-4 py-3">{p.lbs}</td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-gray-50 font-medium">
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3">{data.totals.quantity}</td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3">{data.totals.dimQty}</td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3">{data.totals.lbs}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Notes */}
        <Section title="Notes" isOpen={openNotes} onToggle={() => setOpenNotes(v => !v)}>
          <div className="rounded-lg border bg-white p-3">
            <div className="min-h-24 whitespace-pre-wrap text-gray-900">{data.notes}</div>
          </div>
        </Section>
      </div>
    </section>
  );
}
