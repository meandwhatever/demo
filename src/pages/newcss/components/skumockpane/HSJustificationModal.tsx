import React, { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { createPortal } from "react-dom";

export default function HSJustificationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const node = (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop (behind content) */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      {/* Centering container with page scroll if needed */}
      <div className="relative z-10 flex min-h-full items-center justify-center p-4 sm:p-6">
        <section
          role="dialog"
          aria-modal="true"
          aria-label="HS Classification Justification Report"
          className={[
            // dialog box
            "w-full max-w-3xl rounded-2xl bg-white shadow-xl",
            // vertical margins so it never touches the edges
            "my-8 sm:my-12",
            // cap total height to leave room for those margins
            "max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-6rem)]",
            // make the inside a column so header/body/footer behave
            "flex flex-col overflow-hidden",
          ].join(" ")}
        >
          {/* Sticky header */}
          <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
            <h3 className="text-base font-semibold text-gray-900">
              HS Classification Justification Report
            </h3>
            <button
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* Scrollable body (flex-1) with extra bottom padding */}
          <div className="flex-1 overflow-y-auto p-4 pb-24">
            <section className="space-y-2">
              <div className="text-sm font-semibold text-gray-800">Product Evaluated:</div>
              <p className="text-sm leading-6 text-gray-800">
                Telum processor on IBM Z: Integrated AI accelerators for near real-time analytics
                and enhanced performance on the IBM Z® platform. The IBM® Telum® processor is an
                advanced processor that powers many of the features and benefits of the IBM z16®.
                Its successor, the Telum II powering the new IBM z17®, builds on this foundation
                with enhanced performance, increased memory capacity and improved AI acceleration.
                It is designed to help customers achieve business insights at scale across banking,
                finance, trading, insurance applications and customer interactions.
              </p>
              <p className="text-sm font-medium text-gray-900">
                Classification Date: <span className="font-semibold">June 19, 2025</span>
              </p>
            </section>

            <hr className="my-4 border-gray-200" />

            <section className="space-y-2">
              <div className="text-sm font-semibold text-gray-800">Executive Summary:</div>
              <p className="text-sm leading-6 text-gray-800">
                This document provides a detailed audit trail and justification for the Harmonized
                System (HS) classification of Telum processor on IBM Z: Integrated AI accelerators
                for near real-time analytics and enhanced performance on the IBM Z® platform.
              </p>
              <p className="text-sm leading-6 text-gray-800">
                The IBM® Telum® processor is an advanced processor that powers many of the features
                and benefits of the IBM z16®. Its successor, the Telum II powering the new IBM z17®,
                builds on this foundation with enhanced performance, increased memory capacity and
                improved AI acceleration. It is designed to help customers achieve business insights
                at scale across banking, finance, trading, insurance applications and customer
                interactions.
              </p>
              <p className="text-sm leading-6 text-gray-800">
                The classification process used a rule-based engine to assess potential HS chapters
                and headings, supported by explanatory notes and legal texts, resulting in a final
                classification under <span className="font-semibold">HS Code 85423100</span>.
              </p>
            </section>

            <hr className="my-4 border-gray-200" />

            <section className="space-y-3">
              <div className="text-sm font-semibold text-gray-800">
                Step-by-Step Classification Analysis:
              </div>

              <div className="text-sm font-semibold text-gray-800">Product Analysis</div>
              <p className="text-sm text-gray-800">
                Give below are the characteristics extracted from the given description:
              </p>
              <ul className="list-disc space-y-1 pl-6 text-sm text-gray-800">
                <li>
                  <span className="font-medium">Material</span> – (Based on common processor
                  manufacturing) Semiconductor materials (e.g., Silicon)
                </li>
                <li>
                  <span className="font-medium">Function</span> – Advanced processor for the IBM Z
                  platform, providing integrated AI acceleration, enhanced performance, and increased
                  memory capacity.
                </li>
                <li>
                  <span className="font-medium">Product status</span> – Component (An advanced
                  processor designed to power a larger system like the IBM z16 or z17)
                </li>
                <li>
                  <span className="font-medium">Set or Kit</span> – Not a set or kit (It is a single
                  component, even if it's a complex integrated circuit)
                </li>
              </ul>

              <div className="text-sm font-medium text-gray-900">Chapters Considered</div>
              <ul className="list-disc space-y-1 pl-6 text-sm text-gray-800">
                <li>
                  <span className="font-medium">Chapter Title: 85</span>
                </li>
                <li>
                  <span className="font-medium">Reasoning</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Sticky footer */}
          <footer className="sticky bottom-0 z-10 border-t bg-white p-3 text-right">
            <button
              onClick={() => console.log("Download PDF")}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </footer>
        </section>
      </div>
    </div>
  );

  return mounted ? createPortal(node, document.body) : node;
}
