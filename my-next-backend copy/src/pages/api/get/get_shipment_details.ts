// pages/api/get/get_shipment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

/*
model Shipment {
  /// Internal UUID primary key
  id             String   @id @default(utoincrement())
  /// Your “ocn-xxxxxx” business identifier
  shipmentId     String   @unique
  /// FCL, LCL, AIR, etc.
  mode           String?
  mbl_Number     String?
  mbl_url        String?
  hbl_Number     String?  @unique
  hbl_url        String?  @unique
  created_at     DateTime @default(now())
  created_by     String?
  updated_at     DateTime @updatedAt
  updated_by     String?
  updated_reason String?
  /// All containers on this shipment
  containers     Json[]
  /// All freight-charge line items
  freightCharges Json[]
  /// holds involved_party,shipment,containers,freight_charges,customs,shipping_documents,validation_result
  /// dont worry for now
  rawJson        Json?
}
*/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('get_shipment_details.ts called');
  //-- only GET for now ────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shipmentId } = req.body;
  console.log('shipmentId', shipmentId);



  try {
    /*  Adjust the `include` block to cover every relation you
        put in schema.prisma.  Anything not found will come back
        as `null`, so the UI never crashes on missing data.        */
    const shipment = await prisma.shipment.findUnique({
      where: { shipmentId: shipmentId as string },

    });

    if (!shipment) {
      console.log('Shipment not founddafdf');
      return res.status(404).json({ error: 'Shipment not found' });
    }
    console.log('get_shipment_details.ts passed');
    return res.status(200).json(shipment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
