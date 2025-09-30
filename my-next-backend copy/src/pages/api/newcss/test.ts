// pages/api/chat.ts
import { spawnSync } from "child_process";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

// 1) Allow "system" as a valid sender
type ChatMessage = {
  message: string;
  time: string;
  from: "user" | "ai" | "system";
  isPlaceholder?: boolean;
  files?: Array<{
    id: string;
    name: string;
    mime: string;
    size: number;
    formKey: string;
  }>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { history } = (req.body ?? {}) as { history?: ChatMessage[] };
    if (!Array.isArray(history)) return res.status(400).json({ error: "Missing history array" });

    // ---- (2) to (4): Inject Task table snapshot as a system message ----
    // Build an origin we can use server-side
    const origin = (req.headers.origin as string) ?? `http://${req.headers.host}`;
    const resp = await fetch(`${origin}/api/newcss/task/getAllTask`, { method: "GET" });
    if (!resp.ok) {
      console.error("getAllTask failed:", await resp.text());
    } else {
      const data = await resp.json(); // { tasks: [...] }
      const systemMsg: ChatMessage = {
        from: "system",
        time: new Date().toISOString(),
        message: `The current Task table is:\n${JSON.stringify(data, null, 2)}`,
      };
      history.push(systemMsg); // append at the end as requested
    }
    const scriptPath = path.resolve(
      process.cwd(),
      `src/ai/chat.py`,
    )
  
    /* 5 – Run Python synchronously */
    const result = spawnSync('python3', [scriptPath, JSON.stringify(history)], {
      encoding: 'utf-8',
    })
  

    return res.status(200).json({ success: true, reply, saved})  } catch (err) {
    console.error("chat route error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
