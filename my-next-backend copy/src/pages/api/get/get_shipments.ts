import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/get/get_shipments
 * Returns the 5 most-recent shipments, newest first.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('get_shipments.ts called');
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res
      .status(405)
      .end(`Method ${req.method} Not Allowed`);
  }

  try {
    const shipments = await prisma.shipment.findMany({
      orderBy: { created_at: 'desc' }, // change to the correct date field if different
      take: 5,
      select: {
        id: true,           // DB primary key
        created_at: true,    // timestamp
        shipmentId: true,   // your business/shipment number
        mode: true          // e.g. 'Air', 'Ocean', 'Truck'
      }
    });

    // Shape the data exactly how the dashboard expects
    const payload = shipments.map(s => ({
      id: s.id,
      date: s.created_at.toISOString(), // ISO keeps the client formatting flexible
      shipmentId: s.shipmentId,
      mode: s.mode
    }));

    return res.status(200).json(payload);
  } catch (err) {
    console.error('[GET_SHIPMENTS]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}