// taskpage.tsx  (aka Landing)
import React, { useState, useRef } from "react";
import Sidebar from "../sidebar";
import TopNav from "../nav";
import Tasks, { TaskRow } from "../task";
import TaskDetails from "../taskdetails";
import ActionRailSwitch, { RightView, ActionRailSwitchHandle } from "../actionrailswitch";
import SKUPage from "./skupage";

export default function SKU() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // mirror the switch's current view so we can size the left column
  const [rightView, setRightView] = useState<RightView>("rail");
  const leftSpan = rightView === "chat" ? "lg:col-span-7" : "lg:col-span-11"


  const railRef = useRef<ActionRailSwitchHandle>(null);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top nav */}
        <TopNav/>

        {/* Main content */}
         <main className="flex-1 min-h-0 overflow-hidden bg-gray-100 p-3">
        <div className="mx-auto h-full w-full max-w-7xl flex flex-col min-h-0 overflow-hidden">
            {/* Page content */}
            <div className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-12">
              {/* Left: Task list or Task details */}
              <section className={`min-h-0 overflow-y-auto ${leftSpan}`}>
             
                  <SKUPage />

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
