// components/Aichat.tsx
import React, { useImperativeHandle, useState, forwardRef } from "react";
import { PaperclipIcon, ArrowUpIcon, ClockIcon, PencilIcon, X, Minimize2 } from "lucide-react";

// json reply to table helpers
function extractJsonFromCodeFence(text: string): any | null {
  const m = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

type TableShape = { columns: string[]; rows: any[][] };

function objectArrayToTable(arr: Array<Record<string, any>>): TableShape | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  // union of keys across rows (stable order: first row’s keys, then new keys as they appear)
  const seen = new Set<string>(Object.keys(arr[0]));
  for (const row of arr.slice(1)) Object.keys(row).forEach(k => seen.add(k));
  const columns = Array.from(seen);
  const rows = arr.map(r => columns.map(c => r?.[c] ?? ""));
  return { columns, rows };
}

function normalizeAnyToTable(data: any): TableShape | null {
  // Common pattern: { tasks: [...] }
  if (data && Array.isArray(data.tasks)) return objectArrayToTable(data.tasks);
  // Raw array of objects
  if (Array.isArray(data) && data.every(x => x && typeof x === "object" && !Array.isArray(x))) {
    return objectArrayToTable(data as Array<Record<string, any>>);
  }
  // Single object -> one row
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const columns = Object.keys(data);
    return { columns, rows: [columns.map(k => (data as any)[k] ?? "")] };
  }
  return null;
}

function stripFirstJsonFence(text: string): string {
  return text.replace(/```json[\s\S]*?```/i, "").trim();
}

type ChatFileMeta = {
  id: string;
  name: string;
  mime: string;
  size: number;
  formKey: string;
};

type ChatFile = ChatFileMeta & { file: File };

export type ChatItem = {
  message: string;
  time: string;
  from: "user" | "ai";
  isPlaceholder?: boolean;
  files?: ChatFileMeta[];
};

type Props = {
  className?: string;
  onCollapse?: () => void;
};

export type AiChatHandle = {
  /** Programmatically send a message through the same flow as pressing Send */
  sendMessage: (text: string) => void;
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

const AiChatCard = forwardRef<AiChatHandle, Props>(function AiChatCard(
  { className, onCollapse }: Props,
  ref
) {
  const [chatMessage, setChatMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [chatFiles, setChatFiles] = React.useState<ChatFile[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const mockSessions = [
    { id: 1, title: "Chat 1", description: "Description", dateLabel: "Mon" },
    { id: 2, title: "Chat 2", description: "Description", dateLabel: "29/7" },
    { id: 3, title: "Chat 3", description: "Description", dateLabel: "28/7" },
  ];
  const showQuick = chatHistory.length === 0;

  // Core send routine used by both UI button and external calls
  const sendCore = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isProcessing) return;

    setChatMessage("");
    setIsProcessing(true);

    const userMsg: ChatItem = { from: "user", message: trimmed, time: new Date().toISOString() };
    setChatHistory(prev => [...prev, userMsg]);
    const historyForServer = [...chatHistory, userMsg];

    const responsePromise = fetch("/api/newcss/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: historyForServer }),
    }).then(r => r.json());

    let placeholderIdx = -1;
    setChatHistory(prev => {
      placeholderIdx = prev.length;
      return [
        ...prev,
        { from: "ai", message: "Processing…", time: new Date().toISOString(), isPlaceholder: true },
      ];
    });

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

  useImperativeHandle(ref, () => ({
    sendMessage: (text: string) => void sendCore(text),
  }));

  const handleSend = () => sendCore(chatMessage);

  return (
    <div
      className={
        className ??
        "mx-auto w-full max-w-7xl h-full min-h-[28rem] rounded-2xl border-2 bg-white p-4 shadow-lg shadow-gray-300 flex flex-col"
      }
    >
      {/* Card header */}
      <div className="mb-4 flex items-center justify-between shrink-0">
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
            <div className="mb-6 flex items-center justify-between ">
              <h2 className="text-xl font-semibold">Chat History</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory(false)}
                  className="rounded-lg bg-gray-100 p-2 hover:bg-gray-300"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

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
            {chatHistory.length === 0 && (
              <div className="mb-8 mt-32 bg-white text-center">
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

            {/* actual chat history */}
            <div className="pr-2">
              {chatHistory.length > 0 && (
                <div className="mb-6 space-y-4">
                  {chatHistory.map((item, idx) =>
                    item.from === "ai" ? (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="max-w-full rounded-lg bg-slate-50 p-4">
                          {(() => {
                            const payload = extractJsonFromCodeFence(item.message);
                            const table = normalizeAnyToTable(payload);
                            const leading = stripFirstJsonFence(item.message);

                            return (
                              <>
                                {/* leading text before the fenced JSON (if any) */}
                                {leading && (
                                  <p className="mb-3 text-sm text-gray-700 whitespace-pre-wrap">{leading}</p>
                                )}

                                {/* auto-rendered table when ```json ... ``` is present */}
                                {table && (
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse text-sm">
                                      <thead>
                                        <tr>
                                          {table.columns.map(col => (
                                            <th
                                              key={col}
                                              className="border-b px-3 py-2 text-left font-semibold text-gray-700"
                                            >
                                              {col}
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {table.rows.map((row, rIdx) => (
                                          <tr key={rIdx} className="odd:bg-white even:bg-gray-50">
                                            {row.map((cell, cIdx) => (
                                              <td key={cIdx} className="border-b px-3 py-2 align-top text-gray-700">
                                                {typeof cell === "string" || typeof cell === "number"
                                                  ? String(cell)
                                                  : JSON.stringify(cell)}
                                              </td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}

                                {/* fallback: if no fenced JSON and no leading text, show raw */}
                                {!payload && !leading && (
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.message}</p>
                                )}

                                <p className="mt-2 text-xs text-gray-500">{formatTimestamp(item.time)}</p>
                              </>
                            );
                          })()}
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
      <div className="mt-4 shrink-0 rounded-xl p-2">
        {showQuick && (
          <>
            <div className="flex items-center gap-2 px-2 pb-2 text-2xl text-black">
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
                  className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
                  onClick={() => setChatMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="rounded-xl border p-1.5 shadow-md">
          <div className="h-full rounded-md bg-white px-1.5 pb-0 pt-1.5">
            <textarea
              className="h-16 w-full resize-none overflow-y-auto rounded-b-none rounded-t-md p-3 text-md leading-relaxed outline-none placeholder-gray-400"
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
            <div className=" -mt-px flex items-center justify-between rounded-lg rounded-t-none bg-white px-2 py-1.5">
              <div className="relative">
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
                  title="Attach file"
                  onClick={() => setShowAttachMenu(v => !v)}
                >
                  <PaperclipIcon className="h-5 w-5" />
                </button>

                {showAttachMenu && (
                  <div className="absolute bottom-12 left-0 z-50 w-40 rounded-lg border bg-white p-1 shadow-lg">
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload PDF
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={e => {
                    const files = Array.from(e.target.files ?? []).filter(
                      f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
                    );
                    if (!files.length) return;
                    const now = Date.now();
                    setChatFiles(prev => [
                      ...prev,
                      ...files.map((f, i) => ({
                        id: crypto.randomUUID(),
                        name: f.name,
                        mime: f.type || "application/pdf",
                        size: f.size,
                        formKey: `file_${now}_${i}`,
                        file: f,
                      })),
                    ]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    setShowAttachMenu(false);
                  }}
                />
              </div>

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
});

export default AiChatCard;
