import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
// Adjust this import path to where you put the file
import { combineMBLAndHBLToShipment } from './new_build_json';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("build_shipment.ts called")
  try {
    if (req.method !== 'POST') {
        console.log("build_shipment.ts method not allowed")
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { shipmentId, mbl_json, hbl_json } = req.body || {};
    if (!shipmentId || typeof shipmentId !== 'string') {
        console.log("build_shipment.ts missing shipmentId")
      res.status(400).json({ error: 'Missing shipmentId' });
      return;
    }
    if (!mbl_json || !hbl_json) {
        console.log("build_shipment.ts missing mbl_json or hbl_json")
      res.status(400).json({ error: 'Both mbl_json and hbl_json are required' });
      return;
    }

    const shipment_json = combineMBLAndHBLToShipment(mbl_json, hbl_json, shipmentId);
    console.log("passed mbl_json and hbl_json to combineMBLAndHBLToShipment")
    const updated = await prisma.shipment.update({
      where: { shipmentId },
      data: { rawJson: shipment_json },
      select: { shipmentId: true, updated_at: true },
    });

    res.status(200).json({ ok: true, shipment: updated });
  } catch (err) {
    console.error('build_shipment error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
