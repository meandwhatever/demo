import React from "react";
import { InboxIcon, DockIcon } from "lucide-react";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  if (!sidebarOpen) {
    return (
      <button
        onClick={() => setSidebarOpen(true)}
        title="Expand"
        aria-label="Expand sidebar"
        className="fixed top-3 left-0 z-50 h-10 w-10
                   rounded-l-none rounded-r-full bg-gray-100 border-r border-gray-200
                   flex items-center justify-center"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    );
  }

  return (
    <div className="relative h-full w-[280px]">
      {/* Collapse button */}
      <button
        onClick={() => setSidebarOpen(false)}
        title="Collapse"
        aria-label="Collapse sidebar"
        className="absolute top-3 -right-10 z-50 h-10 w-10
                   rounded-l-none rounded-r-full bg-gray-100 
                   flex items-center justify-center border-r border-gray-200"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex h-full flex-col">
        <div className="relative z-30 flex items-center gap-2 
                        bg-gray-100 px-4 py-3 
                        border-b border-r border-gray-200">
          <div className="h-5 w-5 rounded-sm bg-orange-500" />
          <span className="text-base font-semibold">Headphones.com</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-8 px-4">
            {/* Operator Inbox */}
            <section>
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <InboxIcon className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold">Operator Inbox</span>
                </div>
                <button className="inline-flex h-5 items-center px-2 text-xs text-blue-600 hover:underline">All</button>
              </div>

              {/* vertical guide + list */}
              <div className="relative mt-1 pl-7 text-sm">
                <div aria-hidden className="absolute inset-y-0 left-3 border-l border-gray-200" />
                <ul className="space-y-1">
                  <li className="flex items-center justify-between py-1">
                    <span>Tasks</span>
                    <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-2 text-[11px] text-white">5</span>
                  </li>
                  <li className="flex items-center justify-between py-1">
                    <span>Notifications</span>
                    <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center px-2 text-[11px] text-gray-600">5</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Products */}
            <section>
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <DockIcon className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold">Products</span>
                </div>
                <button className="inline-flex h-5 items-center px-2 text-xs text-blue-600 hover:underline">All</button>
              </div>

              <div className="relative mt-1 pl-7 text-sm">
                <div aria-hidden className="absolute inset-y-0 left-3 border-l border-gray-200" />
                <ul className="space-y-1 pl-7 text-sm">
                  <li className="flex items-center justify-between py-1">
                    <span>PO Submitted</span>
                    <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center px-2 text-[11px] text-gray-600">5</span>
                  </li>
                  <li className="flex items-center justify-between py-1">
                    <span>In transition</span>
                    <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center px-2 text-[11px] text-gray-600">5</span>
                  </li>
                  <li className="flex items-center justify-between py-1">
                    <span>Shipment Delayed</span>
                    <span className="min-w-[1.25rem] rounded-full bg-red-500 px-2 text-center text-[11px] leading-5 text-white">5</span>
                  </li>
                  <li className="flex items-center justify-between py-1">
                    <span>In Custom</span>
                    <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center px-2 text-[11px] text-gray-600">5</span>
                  </li>
                  <li className="flex items-center justify-between py-1">
                    <span>Custom Delayed</span>
                    <span className="min-w-[1.25rem] rounded-full bg-red-500 px-2 text-center text-[11px] leading-5 text-white">5</span>
                  </li>
                  <li className="flex items-center justify-between py-1">
                    <span>Received</span>
                    <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center px-2 text-[11px] text-gray-600">5</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Documents */}
            <section>
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {/* simple document icon */}
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                  <span className="font-semibold">Documents</span>
                </div>
                <button className="inline-flex h-5 items-center px-2 text-xs text-blue-600 hover:underline">All</button>
              </div>

              <div className="relative mt-1 pl-7 text-sm">
                <div aria-hidden className="absolute inset-y-0 left-3 border-l border-gray-200" />
                <ul className="space-y-1 pl-7 text-sm">
                  <li className="flex items-center justify-between py-1">
                    <span>Discrepancies</span>
                    <span className="min-w-[1.25rem] rounded-full bg-red-500 px-2 text-center text-[11px] leading-5 text-white">5</span>
                  </li>
                  <li className="flex items-center justify-between py-1">
                    <span>Missing Information</span>
                    <span className="min-w-[1.25rem] rounded-full bg-red-500 px-2 text-center text-[11px] leading-5 text-white">5</span>
                  </li>
                  <li className="flex items-center justify-between py-1">
                    <span>Completed</span>
                    <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center px-2 text-[11px] text-gray-600">5</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </nav>
      </div>
    </div>
  );
}
