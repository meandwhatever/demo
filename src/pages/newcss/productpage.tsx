// taskpage.tsx  (aka Landing)
import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import TopNav from "./components/nav";
import Tasks, { TaskRow } from "./components/task";
import TaskDetails from "./components/taskdetails";
import ActionRailSwitch, { RightView } from "./components/actionrailswitch";

export default function Landing() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);

  // mirror the switch's current view so we can size the left column
  const [rightView, setRightView] = useState<RightView>("rail");
  const leftSpan = rightView === "chat" ? "lg:col-span-7" : "lg:col-span-11"

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
        <div className="mx-auto h-full w-full max-w-7xl rounded-2xl border-2 shadow-lg shadow-gray-300 flex flex-col min-h-0 overflow-hidden">
            {/* Page content */}
            <div className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-12">
              {/* Left: Task list or Task details */}
              <section className={`min-h-0 overflow-y-auto ${leftSpan}`}>
                {selectedTask ? (
                  <TaskDetails
                    task={selectedTask}
                    onBack={() => setSelectedTask(null)}
                  />
                ) : (
                  <Tasks onRowClick={(t: TaskRow) => setSelectedTask(t)} />
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
