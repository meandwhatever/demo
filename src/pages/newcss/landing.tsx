import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import TopNav from "./components/nav";
import AiChatCard from "./components/Aichat";

export default function Landing() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col min-h-0">
        <TopNav />
        <main className="flex-1 p-5 bg-gray-100 min-h-0">
            
          <AiChatCard />
          
        </main>
      </div>
    </div>
  );
}
