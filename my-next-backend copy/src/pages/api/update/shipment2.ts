// pages/api/update/shipment.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';
/*
model Shipment {
  /// Internal key
  id             Int   @id @default(autoincrement())
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

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('shipment2.ts called');
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const {
      fileId,
      fileType,          // 'mbl' | 'hbl'
      fileUrl,
      rawJson,
      mode               // ocean, air, etc.  (optional)
    } = req.body as {
      fileId: string
      fileType: 'mbl' | 'hbl'
      fileUrl: string
      rawJson?: any
      mode?: string
    }

    if (!fileId || !fileType || !fileUrl) {
      console.log('Missing required fields', fileId, fileType, fileUrl)
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    let shipment
    let updateReason = ''

    console.log('reached here')

    /* -------------------------------------------------------- *
     *  MBL branch
     * -------------------------------------------------------- */
    if (fileType === 'mbl') {
      const existing = await prisma.shipment.findFirst({
        where: { mbl_Number: fileId }
      })

      if (existing) {
        shipment = await prisma.shipment.update({
          where: { id: existing.id },
          data: {
            mbl_url: fileUrl,
            mode
          }
        })

        updateReason = 'update mbl url'
      } else {
        shipment = await prisma.shipment.create({
          data: {
            shipmentId: uuidv4(),
            mbl_Number: fileId,
            mbl_url: fileUrl,
            mode
          }
        })
        updateReason = 'create shipment from mbl'
      }
    }

    /* -------------------------------------------------------- *
     *  HBL branch
     * -------------------------------------------------------- */
    if (fileType === 'hbl') {
      const mblNumber = rawJson?.shipment?.mbl_number as string | undefined

      if (!mblNumber) {
        res
          .status(400)
          .json({ error: 'mbl number not found' })
        return
      }

      const existing = await prisma.shipment.findFirst({
        where: { mbl_Number: mblNumber }
      })

      if (existing) {
        shipment = await prisma.shipment.update({
          where: { id: existing.id },
          data: {
            hbl_Number: fileId,
            hbl_url: fileUrl
          }
        })
        updateReason = 'update shipment with hbl'
      } else {
        shipment = await prisma.shipment.create({
          data: {
            shipmentId: uuidv4(),
            mbl_Number: mblNumber,
            hbl_Number: fileId,
            hbl_url: fileUrl,
            mode
          }
        })
        updateReason = 'create shipment from hbl'
      }
    }

    /* -------------------------------------------------------- *
     *  Write audit entry (type = 2)
     * -------------------------------------------------------- */
    if (shipment) {
      await prisma.actions.create({
        data: {
          type: 2,
          id: shipment.shipmentId,   // adjust field names if your schema differs
          updated_reason: updateReason
        }
      })
    }

    res.status(200).json({ shipment })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
