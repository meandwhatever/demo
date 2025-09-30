import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { spawnSync } from 'child_process'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma =
  (global as any).prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  })
if (process.env.NODE_ENV !== 'production') (global as any).prisma = prisma

interface ChatMessage {
  from: 'user' | 'ai' | 'system'
  message: string
  time: string
}
interface ChatRequest {
  history: ChatMessage[]
}
interface ChatResponse {
  success: boolean
  reply?: string
  classificationId?: string
  error?: unknown
  saved?: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>,
) {
  console.log("chat.ts called")
  /* 1 â€“ Allow POST only */
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ success: false, error: 'Method Not Allowed' })
  }

  /* 2 â€“ Validate body */
  const { history } = req.body as ChatRequest
  if (!Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ success: false, error: 'Empty history' })
  }
  const proto = (req.headers["x-forwarded-proto"] as string) ?? "http";
  const host = req.headers.host as string;
  const url = `${proto}://${host}/api/newcss/task/getAllTask`;


  const resp = await fetch(url, { method: "GET" });
  if (!resp.ok) {
    console.error("getAllTask failed:", await resp.text());
  } else {
    const data = await resp.json(); // { tasks: [...] }
    history.push({
      from: "system",
      time: new Date().toISOString(),
      message: `The current Task table is:\n${JSON.stringify(data, null, 2)}`,
    });
  }

 console.log("history is", history)






  /* 4 â€“ Pick the Python script */
  const scriptPath = path.resolve(
    process.cwd(),
    `src/ai/chat.py`,
  )

  /* 5 â€“ Run Python synchronously */
  const result = spawnSync('python3', [scriptPath, JSON.stringify(history)], {
    encoding: 'utf-8',
  })

  if (result.error || result.status !== 0) {
    console.error('python-error:', result.stderr || result.error)
    return res
      .status(500)
      .json({ success: false, error: result.stderr || result.error })
  }

  /* 6 â€“ Clean reply text */
  let reply = result.stdout.replace(/^AI reply:\s*/, '').trim()


  let saved = true;

  /* 8 â€“ Done */
  console.log("reply is", reply)
  return res.status(200).json({ success: true, reply, saved})
}