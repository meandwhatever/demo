// src/pages/api/alerts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';          // adjust the path if your prisma helper lives elsewhere

/**
 * GET /api/alerts
 * Returns all classifications that still need manual review, ordered most‑recent first.
 * The shape of each record is kept small to minimise network payloads.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const alerts = await prisma.classification.findMany({
      where: { need_Review: true },          // Prisma substitutes the correct SQL for boolean comparison
      orderBy: { createdAt: 'desc' },        // assumes you track when the record was created / updated
      select: {                              // expose only what the UI needs
        id: true,
        hs_code: true,
        product_title: true,
        confidence: true,
        product_description: true,
        createdAt: true,
      },
    });

    return res.status(200).json(alerts);
  } catch (err) {
    console.error('Failed to fetch review alerts', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}