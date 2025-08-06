'use client'
//src/components/AIChatInterface.tsx
import { useState, useEffect, useRef, ChangeEvent } from 'react';

import { Sparkles, Send, Upload, History, ChevronUp, ChevronDown, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatItem } from '@/pages/Index';
import { Dispatch, SetStateAction } from 'react';

/** Format an ISO string into “Jul 21, 12:34 PM CDT” in the user’s time zone */
const formatTimestamp = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });


interface AIChatInterfaceProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  chatMessage: string;
  setChatMessage: (message: string) => void;
  hideQuickSuggestions?: boolean;
  isVisible?: boolean;
  onToggle?: () => void;
  showTitleBar?: boolean;
  onUploadClick?: () => void;
  //for realtime data saving and updating
  onDataSaved?: () => void;
  chatHistory: ChatItem[];
  setChatHistory?: Dispatch<SetStateAction<ChatItem[]>>;  
}



const AIChatInterface = ({
  activeTab,
  setActiveTab,
  //current text in the chat input
  chatMessage,
  setChatMessage,
  hideQuickSuggestions = false,
  isVisible = true,
  onToggle ,
  showTitleBar = true,
  onUploadClick,
  onDataSaved,
  chatHistory,
  setChatHistory,
}: AIChatInterfaceProps) => {
  // Toggle chat‑history side panel
  const [showChatHistory, setShowChatHistory] = useState(false);


  // Hold last AI reply so we can surface it elsewhere if desired
  const [aiReply, setAiReply] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /** keep the view pinned to the latest message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

//helpers for showing a processing message
const [isProcessing, setIsProcessing] = useState(false);

  const pushPlaceholder = (text: string): number => {
    // snapshot current length *before* we schedule the state update
    const idx = chatHistory.length
    const placeholder: ChatItem = {
      from: 'ai',
      message: text,
      time: new Date().toISOString(),
      isPlaceholder: true,
    }
    setChatHistory(prev => [...prev, placeholder])
    return idx
  }
  
    const replacePlaceholder = (idx: number, text: string) => {
      setChatHistory(prev =>
        prev.map((item, i) => (i === idx ? { ...item, message: text, isPlaceholder: false } : item)),
      );
    };






    // for file upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  //upload file to server
  const handleUploadClick = () => {
    fileInputRef.current?.click(); 
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsProcessing(true);

    for (const file of Array.from(e.target.files)) {
      const formData = new FormData();
      formData.append('file', file);       // field name = "file" (server expects this)
      const idx = pushPlaceholder('Processing…' + file.name);
      try {
        const res = await fetch('/api/upload/file', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message ?? 'Upload failed');
        if (data.saved) {
          console.log('onDataSaved fired');     // DEBUG
          onDataSaved?.();
        }
        //update the shipment json
        await fetch('/api/update/shipment', {
          method:'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file_Id: data.fileId,
            file_Type: data.fileType,
            rawJson: data.rawJson,
            mode: data.rawJson.shipment.mode,
            user: 'user', //not implemented yet
          }),
        });



        // Optional confirmation bubble in the chat
        replacePlaceholder(idx, `✅ Uploaded **${file.name}**.`);
      } catch (err) {
        console.error(err);
        replacePlaceholder(idx, `⚠️  Upload of *${file.name}* failed.`);
      }
    }
    setIsProcessing(false);
    e.target.value = '';                   // allow re-selecting same file later
  };



  


  const suggestions = [
    'Help me classify freight items',
    'What documents are needed for customs?',
    'Check shipment tracking status',
    'Explain HS code requirements',
  ];

  // POST user prompt -> /api/aichat/chat, append both sides of exchange to history
  const handleSend = async () => {
    const trimmed = chatMessage.trim();
    if (!trimmed || isProcessing) return;
  
    setChatMessage('');
    setIsProcessing(true);
  
    // 1️⃣  Build the user bubble and show it immediately
    const userMsg: ChatItem = { from: 'user', message: trimmed, time: new Date().toISOString() };
    setChatHistory(prev => [...prev, userMsg]);
  
    // 2️⃣  Prepare the payload **without** the placeholder
    const historyForServer = [...chatHistory, userMsg];
  
    // 3️⃣  Fire the request but don’t await yet
    const responsePromise = fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: historyForServer }),
    }).then(r => r.json());
  
    // 4️⃣  Now append the placeholder and remember its index
    let placeholderIdx = -1;
    setChatHistory(prev => {
      placeholderIdx = prev.length;                  // index where the placeholder lands
      return [
        ...prev,
        { from: 'ai', message: 'Processing…', time: new Date().toISOString(), isPlaceholder: true },
      ];
    });
  
    // 5️⃣  Await the reply and swap the placeholder
    const data = await responsePromise;
    setIsProcessing(false);
  
    setChatHistory(prev =>
      prev.map((m, i) =>
        i === placeholderIdx
          ? { ...m, message: data.reply ?? `⚠️  ${data.error ?? 'Chat error'}`, isPlaceholder: false }
          : m,
      ),
    );
  
    if (data.saved) onDataSaved?.();
  };


  return (
    <div className="h-full bg-white flex flex-col">
      {/* Title bar */}
      {showTitleBar && (
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <img
              src="/lovable-uploads/3e3238a5-b33b-4ed6-97f3-02922f987598.png"
              alt="AI Copilot"
              className="w-12 h-12 flex-shrink-0 font-black"
            />
            <h3 className="font-bold text-lg text-purple-700">AI Copilot</h3>
            {onToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 hover:bg-purple-100 font-bold"
              >
                {isVisible ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            )}
          </div>
          {/* show chat history */}
          <Button
          
            variant="ghost"
            size="sm"
            onClick={() => setShowChatHistory(!showChatHistory)}
            className="flex items-center space-x-2"
          >
            <History className="w-4 h-4" />
            <span className="text-sm">History</span>
          </Button>
        </div>
      )}

      <div className="flex-1 flex">
        {/* Main Chat Column */}
        <div className={`${showChatHistory ? 'w-2/3' : 'w-full'} flex flex-col`}>
          {/* Scrollable messages */}
          <div className="flex-1 min-h-0 p-6 overflow-y-auto max-h-[65vh]">
          <div className="space-y-4">
              {/* Static welcome */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-50 rounded-lg p-4 max-w-md">
                  <p className="text-sm text-slate-700">
                    Hello! I'm your AI Copilot. How can I help you today?
                  </p>
                </div>
              </div>

              {/* Dynamic chat history */}
              {
              chatHistory.map((item, idx) =>
                item.from === 'ai' ? (
                  /* ---------- AI message (LEFT, with icon) ---------- */
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 max-w-md">
                      <p className="text-sm text-slate-700">{item.message}</p>
                      <p className="text-xs text-slate-500">{formatTimestamp(item.time)}</p>
                    </div>
                  </div>
                ) : (
 /* ---------- USER message (RIGHT, with icon) ---------- */
                  <div key={idx} className="flex items-start justify-end space-x-3">
                    {/* chat bubble */}
                    <div className="bg-blue-600 text-white rounded-lg p-4 max-w-md">
                      <p className="text-sm">{item.message}</p>
                      <p className="text-xs opacity-80 text-right">{formatTimestamp(item.time)}</p>
                    </div>

                    {/* default user avatar */}
                    <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-black" />
                    </div>
                  </div>
                )
              )}
              <div ref={messagesEndRef} />

              {/* Quick suggestions */}
              {!hideQuickSuggestions && chatHistory.length === 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 px-2">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setChatMessage(s)}
                        className="text-xs bg-white border border-slate-200 rounded-full px-3 py-1 hover:bg-slate-50 hover:border-blue-200 transition-colors text-slate-600"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input row */}
          <div className="p-6 border-t border-slate-100">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <textarea
                  placeholder={`Ask about ${
                    activeTab === 'classification'
                      ? 'freight classification and HS codes'
                      : activeTab === 'documents'
                      ? 'shipping document processing'
                      : 'shipment tracking and logistics'
                  }.`}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  rows={2}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                {/* hidden file input + visible trigger */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf"          /* tweak types as needed */
                  onChange={handleFileChange}
                  className="hidden"
                />

                <Button
                  onClick={handleUploadClick}
                  disabled={isProcessing}
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 p-1 h-8 w-8"
                  title="Upload PDF(s)"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                </Button>
              </div>
              <Button onClick={handleSend} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 self-end">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Optional slide‑in history panel (still static placeholder) */}
        {showChatHistory && (
          <div className="w-1/3 border-l border-slate-200 bg-slate-50 p-4 overflow-y-auto">
            <h4 className="font-medium text-slate-700 mb-3">Chat History</h4>
            <div className="space-y-2">
              {chatHistory.map((item, idx) => (
                <div key={idx} className="p-2 bg-white rounded text-sm border">
                  <p className="text-slate-600 text-xs mb-1">{item.time}</p>
                  <p className="text-slate-800 truncate">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatInterface;
