// taskpage.tsx  (aka Landing)
import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import TopNav from "./components/nav";
import AiChatCard from "./components/Aichat";
import Tasks, { TaskRow } from "./components/task";
import TaskDetails from "./components/taskdetails";
import ActionRail from "./components/actionrails";

export default function Landing() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col min-h-0">
        <TopNav />

        {/* Content */}
        <main className="flex-1 min-h-0 overflow-hidden bg-gray-100 p-5">
          <div className="mx-auto h-full min-h-0 w-full max-w-7xl">
            {selectedTask ? (
              // Detail view replaces BOTH Tasks and AiChatCard
              <TaskDetails
                task={selectedTask}
                onBack={() => setSelectedTask(null)}
                // docUrl="/some.pdf" // optional
              />
            ) : (
              <div className="grid h-full min-h-0 grid-cols-1 gap-5 lg:grid-cols-12">
                <section className="min-h-0 lg:col-span-7">
                  <Tasks
                    onClose={() => setSelectedTask(null)}
                    onRowClick={(row) => setSelectedTask(row)}
                  />
                </section>

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
