import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { shipmentId } = req.body ?? {};
    if (!shipmentId || typeof shipmentId !== 'string') {
      console.log('Missing required field: shipmentId', shipmentId);
      res.status(400).json({ error: 'Missing required field: shipmentId' });
      return;
    }

    const shipment = await prisma.shipment.findUnique({
      where: { shipmentId },
    });

    if (!shipment) {
      console.log('Shipment not found', shipmentId);
      res.status(404).json({ error: 'Shipment not found' });
      return;
    }

    const mblNumber = shipment.mbl_Number ?? null;
    const hblNumber = shipment.hbl_Number ?? null;

    const [mblDoc, hblDoc] = await Promise.all([
      mblNumber
        ? prisma.mbl_Document.findFirst({
            where: { file_id: mblNumber },
            select: { rawJson: true },
          })
        : Promise.resolve(null),
      hblNumber
        ? prisma.hbl_Document.findFirst({
            where: { file_id: hblNumber },
            select: { rawJson: true },
          })
        : Promise.resolve(null),
    ]);

    res.status(200).json({
      ...shipment,
      mblRawJson: mblDoc?.rawJson ?? null,
      hblRawJson: hblDoc?.rawJson ?? null,
    });
  } catch (err) {
    console.error('get_shipment_details error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
