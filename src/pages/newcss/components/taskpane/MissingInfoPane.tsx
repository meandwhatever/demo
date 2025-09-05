// components/MissingInfoPane.tsx
import React from "react";
import { CheckCircle2, ChevronDown, X } from "lucide-react";

type Props = { onClose: () => void };

export default function MissingInfoPane({ onClose }: Props) {
  return (
    <div className="relative flex h-full min-h-0 flex-col rounded-2xl border bg-white">
      {/* Close (X) */}
      <button
        onClick={onClose}
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
        title="Hide digitised fields"
        aria-label="Hide digitised fields"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header + Tabs */}
      <div className="border-b p-3 pr-12">
        <h2 className="text-sm font-semibold text-gray-900">Digitised Fields</h2>

        <div className="mt-3 flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md border bg-gray-900 px-3 py-1.5 text-xs font-medium text-white">
            <CheckCircle2 className="h-3.5 w-3.5" /> Involved Parties
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            Shipment Details
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            Container Details
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            Charges
          </button>
        </div>
      </div>

      {/* Scrollable form area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {/* Involved Parties */}
        <div className="rounded-xl border">
          <button
            className="flex w-full items-center justify-between rounded-t-xl bg-gray-50 px-4 py-3 text-left"
            type="button"
          >
            <div className="text-sm font-medium text-gray-900">
              Involved Parties
            </div>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>

          <div className="space-y-6 px-4 py-4">
            {/* Shipper */}
            <div>
              <div className="text-sm font-medium text-gray-900">Shipper</div>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Name" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm" rows={3} placeholder="Address" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Country" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="City" />
                </div>
              </div>
            </div>

            {/* Consignee */}
            <div>
              <div className="text-sm font-medium text-gray-900">Consignee</div>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Name" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm" rows={3} placeholder="Address" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Country" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="City" />
                </div>
              </div>
            </div>

            {/* Notify Party */}
            <div>
              <div className="text-sm font-medium text-gray-900">Notify Party</div>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Name" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm" rows={3} placeholder="Address" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Country" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="City" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add your other sections (Shipment Details, Container Details, Charges) here, same pattern */}
      </div>
    </div>
  );
}
