// components/actionrailswitch.tsx
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import ActionRail from "./actionrails";
import AiChatCard, { AiChatHandle } from "./Aichat";

export type RightView = "rail" | "chat";

type Props = {
  className?: string;
  onViewChange?: (view: RightView) => void;
};

export type ActionRailSwitchHandle = {
  /** Opens the chat (if closed) and sends a message */
  openChatAndSend: (text: string) => void;
};

const ActionRailSwitch = forwardRef<ActionRailSwitchHandle, Props>(function ActionRailSwitch(
  { className, onViewChange }: Props,
  ref
) {
  const [view, setView] = useState<RightView>("rail");
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const chatRef = useRef<AiChatHandle>(null);

  useImperativeHandle(ref, () => ({
    openChatAndSend: (text: string) => {
      setPendingMessage(text);
      setView("chat");
    },
  }));

  useEffect(() => {
    onViewChange?.(view);
  }, [view, onViewChange]);

  // Once chat is mounted and there's a pending message, push it in.
  useEffect(() => {
    if (view === "chat" && pendingMessage) {
      // allow first paint of AiChat before we call into the ref
      const id = requestAnimationFrame(() => {
        chatRef.current?.sendMessage(pendingMessage);
        setPendingMessage(null);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [view, pendingMessage]);

  const rightSpan = view === "chat" ? "lg:col-span-5" : "lg:col-span-1";

  return (
    <aside className={`min-h-0 ${rightSpan} ${className ?? ""} flex flex-col`}>
      {view === "rail" ? (
        <ActionRail
          className="relative top-10 -right-2 self-start"
          onExpand={() => setView("chat")}
        />
      ) : (
        <AiChatCard
          ref={chatRef}
          onCollapse={() => setView("rail")}
          className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border bg-white p-4 shadow"
        />
      )}
    </aside>
  );
});

export default ActionRailSwitch;
