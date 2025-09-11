import React from "react";

export default function PositioningExample() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* 1) Relative parent + absolute children */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">1) relative + absolute (corner badges)</h2>
          <div className="relative h-48 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200">
            {/* Parent is relative -> children can use absolute */}
            <span className=" left-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
              Top-Left
            </span>
            <span className="absolute right-3 top-3 rounded-full bg-pink-600 px-3 py-1 text-xs font-medium text-white">
              Top-Right
            </span>
            <span className="absolute bottom-3 left-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
              Bottom-Left
            </span>
            <span className="absolute bottom-3 right-3 rounded-full bg-orange-600 px-3 py-1 text-xs font-medium text-white">
              Bottom-Right
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Container uses <code>relative</code>. Badges use <code>absolute</code> with directional
            utilities like <code>top-3 right-3</code>.
          </p>
        </section>

        {/* 2) Absolute centering (two common patterns) */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">2) Absolute centering</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* 2a) translate trick */}
            <div className="relative h-48 rounded-xl bg-slate-100">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
                Centered via <code>left-1/2 top-1/2 translate</code>
              </div>
            </div>

            {/* 2b) inset-0 + m-auto trick */}
            <div className="relative h-48 rounded-xl bg-slate-100">
              <div className="absolute inset-0 m-auto h-12 w-64 rounded-lg bg-slate-900 px-4 py-2 text-center text-sm text-white">
                Centered via <code>absolute inset-0 m-auto</code>
              </div>
            </div>
          </div>
        </section>

        {/* 3) Fixed element (e.g., FAB) */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">3) fixed (floating action button)</h2>
          <p className="text-sm text-gray-600">
            The button stays at the viewport corner due to <code>fixed bottom-6 right-6</code>.
          </p>
          <button
            className="fixed bottom-6 right-6 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg"
            onClick={() => alert("I'm fixed to the viewport!")}
          >
            Fixed Action
          </button>
          <div className="mt-4 rounded-lg border bg-gray-50 p-4 text-sm text-gray-600">
            Scroll the page—you’ll see the button remain in place.
          </div>
        </section>

        {/* 4) Sticky header inside a scrollable container */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">4) sticky (within a scroll container)</h2>
          <div className="h-64 overflow-y-auto rounded-xl border">
            <div className="sticky top-0 z-10 bg-white/90 p-3 backdrop-blur">
              <div className="rounded-lg border bg-slate-50 px-3 py-2 text-sm font-medium">
                I stick to the top (class: <code>sticky top-0</code>)
              </div>
            </div>
            <ul className="space-y-3 p-4 text-sm text-gray-700">
              {Array.from({ length: 24 }).map((_, i) => (
                <li key={i} className="rounded-lg border bg-gray-50 p-3">
                  Scroll item #{i + 1}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Sticky works when the parent can scroll (<code>overflow-y-auto</code>) and the element has a{" "}
            <code>top</code> offset.
          </p>
        </section>

        {/* 5) Z-index stacking */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">5) z-index (stacking order)</h2>
          <div className="relative h-48 rounded-xl bg-slate-100">
            <div className="absolute left-6 top-8 h-24 w-40 rounded-lg bg-indigo-400 p-3 text-sm text-white shadow-md">
              z-10 (behind)
            </div>
            <div className="absolute left-16 top-16 z-20 h-24 w-40 rounded-lg bg-pink-500 p-3 text-sm text-white shadow-md">
              z-20 (on top)
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Use <code>z-10</code>, <code>z-20</code>, etc. to control stacking of positioned elements.
          </p>
        </section>

        {/* 6) Tooltip via group hover + absolute */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">6) Tooltip (group-hover + absolute)</h2>
          <button className="group relative rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
            Hover me
            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-xs text-white shadow group-hover:block">
              Positioned tooltip with <code>absolute</code>
            </span>
          </button>
          <p className="mt-3 text-sm text-gray-600">
            Parent is <code>relative</code>, tooltip is <code>absolute</code> and shown with{" "}
            <code>group-hover</code>.
          </p>
        </section>
      </div>
    </main>
  );
}
