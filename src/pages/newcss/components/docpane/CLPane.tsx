import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, X } from "lucide-react";
import type { DocumentRow } from "../documents";

type Props = {
  document: DocumentRow;
  onClose: () => void;
};

// --- Mocked CI data (pull anything you want from `document`) ---
function buildCIData(doc: DocumentRow) {
  return {
    invoiceDetails: {
      invoiceNo: "GRA-200348",
      date: "14-August-2025",
      currency: "USD",
      countryOfOrigin: "UK",
      blAwbNo: "-",
      finalDestination: "UK",
      exportRoute: "-",
      termsOfSale: "-",
      termsOfPayment: "-",
      termsOfFreight: "-",
      numPackages: "-",
      notes: "RETURN OF UNSOLD STOCK TO ORIGINAL MANUFACTURER",
    },
    shipper: {
      company: "Headphones Inc",
      address: "4210 B St NW, Suite J",
      city: "Auburn",
      state: "WA",
      zip: "98001",
    },
    consignee: {
      company: "Warwick Acoustics",
      address: "MIRA Technology Park – Unit 3, NW07, Watling Street",
      city: "Nuneaton",
      state: "WK",
      zip: "CV10 0TU",
    },
    products: [
      {
        item: "Warwick…",
        hsCode: "-",
        unitValue: "$5,500",
        quantity: 4,
        weight: "236.10",
        value: "$22,000.00",
      },
      {
        item: "Warwick…",
        hsCode: "-",
        unitValue: "$6,500",
        quantity: 6,
        weight: "354",
        value: "$39,000.00",
      },
    ],
    pricing: {
      freight: "-",
      insurance: "-",
      totalValue: "$61,000.00",
    },
  };
}

// --- Small collapsible section helper ---
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

export default function CLPane({ document, onClose }: Props) {
  const data = useMemo(() => buildCIData(document), [document]);
  const [openInv, setOpenInv] = useState(true);
  const [openShipper, setOpenShipper] = useState(true);
  const [openConsignee, setOpenConsignee] = useState(true);
  const [openProducts, setOpenProducts] = useState(true);
  const [openPricing, setOpenPricing] = useState(true);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-2xl bg-white p-3">
      {/* Header */}
      <header className="mb-2 flex items-start justify-between">
        <h2 className="text-xl font-semibold text-gray-900">CI Digitised Fields</h2>
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
        {/* Invoice Details */}
        <Section title="Invoice Details" isOpen={openInv} onToggle={() => setOpenInv((v) => !v)}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-gray-500">Invoice No.</div>
              <div className="text-gray-900">{data.invoiceDetails.invoiceNo}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Date</div>
              <div className="text-gray-900">{data.invoiceDetails.date}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Currency Used</div>
              <div className="text-gray-900">{data.invoiceDetails.currency}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Country of Origin</div>
              <div className="text-gray-900">{data.invoiceDetails.countryOfOrigin}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">B/L / AWB No.</div>
              <div className="text-gray-900">{data.invoiceDetails.blAwbNo}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Final Destination</div>
              <div className="text-gray-900">{data.invoiceDetails.finalDestination}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Export Route / Carrier</div>
              <div className="text-gray-900">{data.invoiceDetails.exportRoute}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Terms of Sale</div>
              <div className="text-gray-900">{data.invoiceDetails.termsOfSale}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Terms of Payment</div>
              <div className="text-gray-900">{data.invoiceDetails.termsOfPayment}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Terms of Freight</div>
              <div className="text-gray-900">{data.invoiceDetails.termsOfFreight}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">No. of Packages</div>
              <div className="text-gray-900">{data.invoiceDetails.numPackages}</div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <div className="text-sm text-gray-500">Notes</div>
            <p className="text-gray-900">
              {data.invoiceDetails.notes}
            </p>
          </div>
        </Section>

        {/* Shipper / Exporter */}
        <Section
          title="Shipper/ Exporter"
          isOpen={openShipper}
          onToggle={() => setOpenShipper((v) => !v)}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-gray-500">Company</div>
              <div className="text-gray-900">{data.shipper.company}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Address</div>
              <div className="text-gray-900">{data.shipper.address}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">City</div>
              <div className="text-gray-900">{data.shipper.city}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">State</div>
              <div className="text-gray-900">{data.shipper.state}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">ZIP Code</div>
              <div className="text-gray-900">{data.shipper.zip}</div>
            </div>
          </div>
        </Section>

        {/* Consignee */}
        <Section
          title="Consignee"
          isOpen={openConsignee}
          onToggle={() => setOpenConsignee((v) => !v)}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-gray-500">Company</div>
              <div className="text-gray-900">{data.consignee.company}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Address</div>
              <div className="text-gray-900">{data.consignee.address}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">City</div>
              <div className="text-gray-900">{data.consignee.city}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">State</div>
              <div className="text-gray-900">{data.consignee.state}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">ZIP Code</div>
              <div className="text-gray-900">{data.consignee.zip}</div>
            </div>
          </div>
        </Section>

        {/* Products (HORIZONTAL SCROLL) */}
        <Section
          title="Products"
          isOpen={openProducts}
          onToggle={() => setOpenProducts((v) => !v)}
        >
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-[1000px] table-fixed">
              <thead className="bg-gray-50 text-left text-sm text-gray-600">
                <tr>
                  <th className="w-[220px] px-4 py-3 font-medium">Item &amp; Description</th>
                  <th className="w-[120px] px-4 py-3 font-medium">HS Code</th>
                  <th className="w-[140px] px-4 py-3 font-medium">Unit Value</th>
                  <th className="w-[120px] px-4 py-3 font-medium">Quantity</th>
                  <th className="w-[140px] px-4 py-3 font-medium">Weight</th>
                  <th className="w-[160px] px-4 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-900">
                {data.products.map((p, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="block max-w-[220px] truncate">{p.item}</span>
                      </a>
                    </td>
                    <td className="px-4 py-3">{p.hsCode}</td>
                    <td className="px-4 py-3">{p.unitValue}</td>
                    <td className="px-4 py-3">{p.quantity}</td>
                    <td className="px-4 py-3">{p.weight}</td>
                    <td className="px-4 py-3">{p.value}</td>
                  </tr>
                ))}
                {/* Subtotal row (visual summary like the screenshot) */}
                <tr className="bg-gray-50 font-medium">
                  <td className="px-4 py-3">Subtotal…</td>
                  <td className="px-4 py-3">DD-M…</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3">10</td>
                  <td className="px-4 py-3">590.00</td>
                  <td className="px-4 py-3">$61,000.00</td>
                </tr>
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
              <div className="text-sm text-gray-500">Freight</div>
              <div className="text-gray-900">{data.pricing.freight}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Insurance</div>
              <div className="text-gray-900">{data.pricing.insurance}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Value</div>
              <div className="text-gray-900">{data.pricing.totalValue}</div>
            </div>
          </div>
        </Section>
      </div>
    </section>
  );
}
