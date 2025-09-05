// components/Aichat.tsx
import React, { useState } from "react";
import { PaperclipIcon, ArrowUpIcon, ClockIcon, PencilIcon, X, Minimize2 } from "lucide-react";

export type ChatItem = {
  message: string;
  time: string;
  from: "user" | "ai";
  isPlaceholder?: boolean;
};

type Props = {
  className?: string;
  onCollapse?: () => void; // <-- new: collapse chat (show ActionRail)
};

const formatTimestamp = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

export default function AiChatCard({ className, onCollapse }: Props) {
  const [chatMessage, setChatMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const mockSessions = [
    { id: 1, title: "Chat 1", description: "Description", dateLabel: "Mon" },
    { id: 2, title: "Chat 2", description: "Description", dateLabel: "29/7" },
    { id: 3, title: "Chat 3", description: "Description", dateLabel: "28/7" },
  ];

  const showQuick = chatHistory.length === 0;

  const handleSend = async () => {
    const trimmed = chatMessage.trim();
    if (!trimmed || isProcessing) return;

    setChatMessage("");
    setIsProcessing(true);

    // 1) Show user bubble
    const userMsg: ChatItem = { from: "user", message: trimmed, time: new Date().toISOString() };
    setChatHistory(prev => [...prev, userMsg]);

    // 2) Prepare payload without placeholder
    const historyForServer = [...chatHistory, userMsg];

    // 3) Request
    const responsePromise = fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: historyForServer }),
    }).then(r => r.json());

    // 4) Add placeholder
    let placeholderIdx = -1;
    setChatHistory(prev => {
      placeholderIdx = prev.length;
      return [
        ...prev,
        { from: "ai", message: "Processing…", time: new Date().toISOString(), isPlaceholder: true },
      ];
    });

    // 5) Swap placeholder with real reply
    const data = await responsePromise;
    setIsProcessing(false);

    setChatHistory(prev =>
      prev.map((m, i) =>
        i === placeholderIdx
          ? { ...m, message: data.reply ?? `⚠️  ${data.error ?? "Chat error"}`, isPlaceholder: false }
          : m,
      ),
    );
  };

  return (
    <div
      className={
        className ??
        "mx-auto w-full max-w-7xl h-full min-h-[28rem] rounded-2xl border-2 bg-white p-4 shadow-lg shadow-gray-300 flex flex-col"
      }
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white">
            <span className="text-[11px] font-bold">AI</span>
          </div>
          <span className="text-sm font-semibold text-gray-700">AI Assistant</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          <button
            onClick={() => setShowHistory(v => !v)}
            className={`rounded-lg p-2 ${showHistory ? "bg-gray-300" : "hover:bg-gray-300"}`}
            title="Chat history"
          >
            <ClockIcon className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-2 hover:bg-gray-100" title="Compose">
            <PencilIcon className="h-4 w-4" />
          </button>
          {/* NEW: Collapse button to hide chat / show ActionRail */}
          <button
            onClick={onCollapse}
            className="rounded-lg p-2 hover:bg-gray-100"
            title="Collapse chat"
            aria-label="Collapse chat"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* History or Greeting or Chats */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        {showHistory ? (
          <div className="pb-4">
            {/* History header row */}
            <div className="mb-6 flex items-center justify-between ">
              <h2 className="text-xl font-semibold">Chat History</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory(false)}
                  className="rounded-lg p-2 hover:bg-gray-300 bg-gray-100"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* History list */}
            <ul className="divide-y divide-gray-100">
              {mockSessions.map(s => (
                <li key={s.id} className="flex items-start justify-between py-5">
                  <div>
                    <div className="text-base font-medium text-gray-900">{s.title}</div>
                    <div className="text-sm text-gray-500">{s.description}</div>
                  </div>
                  <div className="pt-1 text-sm text-gray-400">{s.dateLabel}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            {/* Greeting (hide once there is any chat) */}
            {chatHistory.length === 0 && (
              <div className="mb-8 mt-32 text-center bg-white">
                <h2 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-xl font-bold leading-7 text-transparent">
                  Hi Jimmy!
                </h2>
                <p className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-lg font-semibold text-transparent">
                  How may I assist you today?
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
                  You can ask me anything — whether it&apos;s about a specific product,
                  document, shipment, or a general question.
                </p>
              </div>
            )}

            {/* Chat transcript */}
            <div className="pr-2">
              {chatHistory.length > 0 && (
                <div className="mb-6 space-y-4">
                  {chatHistory.map((item, idx) =>
                    item.from === "ai" ? (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="max-w-md rounded-lg bg-slate-50 p-4">
                          <p className="text-sm text-gray-700">{item.message}</p>
                          <p className="text-xs text-gray-500">{formatTimestamp(item.time)}</p>
                        </div>
                      </div>
                    ) : (
                      <div key={idx} className="flex items-start justify-end space-x-3">
                        <div className="max-w-md rounded-lg bg-blue-600 p-4 text-white">
                          <p className="text-sm">{item.message}</p>
                          <p className="text-right text-xs opacity-80">{formatTimestamp(item.time)}</p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Chat box */}
      <div className="rounded-xl p-2 mt-4 shrink-0">
        {/* Quick suggestions (hide after first message) */}
        {showQuick && (
          <>
            <div className="flex items-center gap-2 px-2 pb-2 text-black text-2xl">
              <span className="text-xs">Quick suggestions:</span>
            </div>

            <div className="mb-2 flex flex-wrap items-center gap-3">
              {[
                "Show me products in transition",
                "What are the tasks I need to complete today",
                "What are the HS Code",
              ].map((s, i) => (
                <button
                  key={i}
                  className="rounded-full border px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50 bg-white border-gray-300"
                  onClick={() => setChatMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Text box + actions */}
        <div className="rounded-xl border p-1.5 shadow-md">
          <div className="bg-white rounded-md px-1.5 pt-1.5 pb-0 h-full">
            <textarea
              className="h-16 w-full resize-none overflow-y-auto rounded-t-md rounded-b-none p-3 text-md outline-none placeholder-gray-400 leading-relaxed"
              placeholder="Type your message here..."
              wrap="soft"
              spellCheck={false}
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="bg-white rounded-lg rounded-t-none -mt-px flex items-center justify-between px-2 py-1.5">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
                title="Attach file"
              >
                <PaperclipIcon className="h-5 w-5" />
              </button>

              <button
                onClick={handleSend}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
                title="Send"
                disabled={isProcessing}
              >
                <ArrowUpIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
