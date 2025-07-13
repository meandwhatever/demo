import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

/* ── Prisma singleton to survive Hot Reload ─────────────────────────────── */
const prisma =
  (global as any).prisma ?? new PrismaClient({ log: ['error'] });
if (process.env.NODE_ENV !== 'production') (global as any).prisma = prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("get_classification.ts called")
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const limitParam = parseInt(req.query.limit as string, 10);
  const take = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 5;

  try {
    const rows = await prisma.classification.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      select: {
        id: true,
        createdAt: true,
        product_title: true,
        product_description: true,
        hs_code: true,
        confidence: true,
      },
    });
    res.status(200).json(rows);
  } catch (err) {
    console.error('api-classifications-error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}