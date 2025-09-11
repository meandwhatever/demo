// components/actionrailswitch.tsx
import React, { useEffect, useState } from "react";
import ActionRail from "./actionrails";
import AiChatCard from "./Aichat";

export type RightView = "rail" | "chat";

type Props = {
  className?: string;
  onViewChange?: (view: RightView) => void;
};

export default function ActionRailSwitch({ className, onViewChange }: Props) {
  const [view, setView] = useState<RightView>("rail"); // default: rail

  useEffect(() => {
    onViewChange?.(view);
  }, [view, onViewChange]);

  // Right column spans 3 when rail, 5 when chat
  const rightSpan = view === "chat" ? "lg:col-span-5" : "lg:col-span-1";

  return (
    <aside className={`min-h-0 ${rightSpan} ${className ?? ""} flex flex-col`}>
      {view === "rail" ? (
        <ActionRail
          // sit inside the grid (not fixed to viewport)
          className="relative top-10 -right-2 self-start"
          onExpand={() => setView("chat")}
        />
      ) : (
        <AiChatCard
          onCollapse={() => setView("rail")}
          // IMPORTANT: keep flex column + height bounds so the composer stays fixed
          className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border bg-white p-4 shadow"
        />
      )}
    </aside>
  );
}
