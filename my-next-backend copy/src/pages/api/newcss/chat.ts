import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { spawnSync } from 'child_process'
import { PrismaClient, Prisma } from '@prisma/client'

/* ───────────── Prisma singleton ───────────── */
const prisma =
  (global as any).prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  })
if (process.env.NODE_ENV !== 'production') (global as any).prisma = prisma

/* ───────────── Types ───────────── */
interface ChatMessage {
  from: 'user' | 'ai'
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

/* ───────────── API handler ───────────── */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>,
) {
  console.log("chat.ts called")
  /* 1 – Allow POST only */
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ success: false, error: 'Method Not Allowed' })
  }

  /* 2 – Validate body */
  const { history } = req.body as ChatRequest
  if (!Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ success: false, error: 'Empty history' })
  }

  /* 3 – Chat vs. Classification? */
  const last = history[history.length - 1]
  const isClassification =
    last.from === 'user' &&
    last.message.trim().toLowerCase().startsWith('classify')

  console.log("isClassification", isClassification)
  console.log("last message", last.message.trim().toLowerCase())

  /* 4 – Pick the Python script */
  const scriptPath = path.resolve(
    process.cwd(),
    `src/ai/${isClassification ? 'classify' : 'chat'}.py`,
  )

  /* 5 – Run Python synchronously */
  const result = spawnSync('python3', [scriptPath, JSON.stringify(history)], {
    encoding: 'utf-8',
  })

  if (result.error || result.status !== 0) {
    console.error('python-error:', result.stderr || result.error)
    return res
      .status(500)
      .json({ success: false, error: result.stderr || result.error })
  }

  /* 6 – Clean reply text */
  let reply = result.stdout.replace(/^AI reply:\s*/, '').trim()

  /* 7 – Optional: persist classification */
  let classificationId: string | undefined
  if (isClassification) {
    console.log("isClassification is true")
    try {
      // ① knock off ``` fences and {' … '} wrapper
      reply = reply
      // 1) strip ``` fences
      .replace(/^\s*```(?:json)?\s*|\s*```\s*$/gi, '')
      // 2) strip {' … '} wrapper
      .replace(/^\{\s*'|'\s*\}$/g, '')
      // 3) kill real and escaped new-lines
      .replace(/[\r\n]+/g, '')
      .replace(/\\n\s*/g, ' ')
      .replace(/\\'/g, "'")
      .trim()

      const jsonString = reply.match(/\{[\s\S]*\}/)![0]

      // ③ parse it
      const payload = JSON.parse(jsonString) as {
      hs_code: string
      confidence: number 
      product_title: string
      product_description: string
      first_two_digits: string
      broader_description: string
      }
      console.log("payload is", payload)

      const record = await prisma.classification.create({
        data: {
          hs_code:             payload.hs_code,
          confidence:          payload.confidence,
          product_title:       payload.product_title,
          product_description: payload.product_description,
          first_two_digits:    payload.first_two_digits,
          broader_description: payload.broader_description,
        },
      })
      console.log("update successful")
      classificationId = record.id
      console.log("classificationId is", classificationId)
    } catch (err) {
      console.error('classification-save-error:', err, '\nraw reply:\n', reply)
      // keep serving the AI reply even if DB insert fails
    }
  }
  let saved = true;

  /* 8 – Done */
  console.log("reply is", reply)
  return res.status(200).json({ success: true, reply, classificationId, saved})
}