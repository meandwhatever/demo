// Product landing page mirroring your taskpage layout.
import React, { useState, useRef } from "react";
import Sidebar from "./components/sidebar";
import TopNav from "./components/nav";
import Products, { ProductRow } from "./components/products";
import ProductDetails from "./components/productdetails";
import ActionRailSwitch, { RightView, ActionRailSwitchHandle } from "./components/actionrailswitch";

export default function ProductPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);

  // Keep same right-rail <-> chat switch behavior as taskpage
  const [rightView, setRightView] = useState<RightView>("rail");
  const leftSpan = rightView === "chat" ? "lg:col-span-7" : "lg:col-span-11";

  const railRef = useRef<ActionRailSwitchHandle>(null);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top nav */}
        <TopNav />

        {/* Main content */}
        <main className="flex-1 min-h-0 overflow-hidden bg-gray-100 p-3">
          <div className="mx-auto h-full w-full max-w-7xl flex flex-col min-h-0 overflow-hidden">
            <div className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-12">
              {/* Left: Products table or Details */}
              <section className={`min-h-0 overflow-y-auto ${leftSpan}`}>
                {selectedProduct ? (
                  <ProductDetails
                    product={selectedProduct}
                    onBack={() => setSelectedProduct(null)}
                  />
                ) : (
                  <Products onRowClick={(p: ProductRow) => setSelectedProduct(p)}
                  onSearchSubmit={(q) => railRef.current?.openChatAndSend(q)} />
                )}
              </section>

              {/* Right: ActionRail <-> AI Chat switch */}
              <ActionRailSwitch ref={railRef} onViewChange={setRightView} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
