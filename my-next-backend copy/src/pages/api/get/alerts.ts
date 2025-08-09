// pages/api/get/alerts.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    // Optional filter: /api/get/alerts?type=2
    const { type } = req.query
    const where =
      typeof type === 'string' && type.trim().length > 0
        ? { type: Number(type) }
        : undefined

    const actions = await prisma.actions.findMany({
      where,
      // If you have a relation set up, you can include linked shipment info:
      // include: { shipment: true },
      // If you want newest first and your column is createdAt, uncomment:
      // orderBy: { createdAt: 'desc' }
    })

    res.status(200).json(actions)
  } catch (err) {
    console.error('GET /api/get/alerts failed', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
