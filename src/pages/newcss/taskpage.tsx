// taskpage.tsx  (aka Landing)
import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import TopNav from "./components/nav";
import AiChatCard from "./components/Aichat";
import Tasks, { TaskRow } from "./components/task";
import TaskDetails from "./components/taskdetails";
import ActionRail from "./components/actionrails"; // ⬅️ new

export default function Landing() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);

  const isDetailsOpen = Boolean(selectedTask);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main column */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Top nav */}
        <TopNav />

        {/* Page content */}
        <main
          className={`flex-1 overflow-hidden bg-gray-100 p-5 ${
            isDetailsOpen ? "pr-24" : ""
          }`}
        >
          <div className="mx-auto h-full w-full max-w-7xl bg-green-500">




            {/* When a task is selected, show TaskDetails; otherwise show Tasks + Chat */}
            {isDetailsOpen ? (
              <div className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
              {/* Left: TaskDetails grows */}
              <TaskDetails
                task={selectedTask as TaskRow}
                onBack={() => setSelectedTask(null)}
              />

              {/* Right: ActionRail column (keeps a fixed “margin” via the grid gap) */}
              <div className="hidden lg:block  justify-self-end w-fit -mr-24 bg-red-500">
                <ActionRail
                  className="sticky top-24 self-start"
                  onPrimaryClick={() => {}}
                  onClock={() => {}}
                  onEdit={() => {}}
                  onUpload={() => {}}
                  onExpand={() => {}}
                />
              </div>
            </div>
            ) : (
              <div className="grid h-full min-h-0 grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Tasks list */}
                <section className="min-h-0 lg:col-span-7">
                  <Tasks
                    // If your Tasks component already emits a row click, wire it here:
                    // onSelectTask={(row: TaskRow) => setSelectedTask(row)}
                    // If it uses a different prop name, swap accordingly.
                    onRowClick={(row: TaskRow) => setSelectedTask(row)}
                  />
                </section>

                {/* Chat panel */}
                <aside className="min-h-0 lg:col-span-5">
                  <AiChatCard />
                </aside>
              </div>
            )}
          </div>
        </main>


      </div>
    </div>
  );
}
