// Document landing page mirroring your ProductPage layout.
import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import TopNav from "./components/nav";
import Documents, { DocumentRow } from "./components/documents";
import DocumentDetails from "./components/documentdetails";
import ActionRailSwitch, { RightView } from "./components/actionrailswitch";

export default function DocumentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRow | null>(null);

  // Same right-rail <-> chat switch behavior
  const [rightView, setRightView] = useState<RightView>("rail");
  const leftSpan = rightView === "chat" ? "lg:col-span-7" : "lg:col-span-11";

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
              {/* Left: Documents table or Details */}
              <section className={`min-h-0 overflow-y-auto ${leftSpan}`}>
                {selectedDoc ? (
                  <DocumentDetails
                    document={selectedDoc}
                    onBack={() => setSelectedDoc(null)}
                  />
                ) : (
                  <Documents onRowClick={(row: DocumentRow) => setSelectedDoc(row)} />
                )}
              </section>

              {/* Right: ActionRail <-> AI Chat switch */}
              <ActionRailSwitch onViewChange={setRightView} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
