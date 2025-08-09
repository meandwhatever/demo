// pages/api/get/classification.ts
//for alerts and actions page, get single classification
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const idParam = req.query.id
    const id = Array.isArray(idParam) ? idParam[0] : idParam

    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Missing or invalid id' })
      return
    }

    // If your Classification primary key is not `id: String`,
    // change this lookup accordingly (e.g., findFirst or numeric parse).
    const classification = await prisma.classification.findUnique({
      where: { id: id as string },
      // If you want to limit fields:
      // select: {
      //   id: true,
      //   hs_code: true,
      //   confidence: true,
      //   product_title: true,
      //   product_description: true,
      //   createdAt: true
      // }
    })

    if (!classification) {
      res.status(404).json({ error: 'Not found' })
      return
    }

    res.status(200).json(classification)
  } catch (err) {
    console.error('GET /api/get/classification failed', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
