// pages/api/shipment.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { build_shipment_json } from '@/pages/api/update/build_shipment_json';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message?: string }>
) {
  console.log('shipment.ts called');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Destructure and normalize names
  const {
    file_Id: fileId,
    file_Type: fileType,
    file_url: fileUrl,
    rawJson,
    mode,
    user,
  } = req.body as {
    file_Id: string;
    file_Type: 'mbl' | 'hbl';
    file_url: string;
    rawJson: any;
    mode: string;
    user: string;
  };

  if (fileType !== 'mbl' && fileType !== 'hbl') {
    return res.status(400).json({ success: false, message: 'Invalid file_Type' });
  }

  // Helper to fetch the uploaded document URL
  async function getDocUrl(
    docType: 'mbl' | 'hbl',
    id: string
  ): Promise<string | null> {
    const model = docType === 'mbl' ? 'mbl_Document' : 'hbl_Document';
    // @ts-ignore
    const doc = await prisma[model].findUnique({
      where: { file_id: id },
      select: { file_Url: true },
    });
    return doc?.file_Url ?? null;
  }

  try {
    if (fileType === 'mbl') {
      // —— CREATE new shipment for MBL ——
  const mblNumber = rawJson.shipment.mbl_number;
  const mblUrl = await getDocUrl('mbl', fileId);

  // 1️⃣ Do we already have one-or-many shipments that reference this MBL?
  const existingShipments = await prisma.shipment.findMany({
    where: { mbl_Number: mblNumber },
  });

  if (existingShipments.length > 0) {
    // —— UPDATE every matching shipment (one-to-many) ——
    const updates = existingShipments.map((s) => {
      const mergedPayload = build_shipment_json({
        mbl_rawJson: rawJson,          // new MBL data
        hbl_rawJson: s.rawJson,        // existing per-row HBL data (may be null)
        shipmentId: s.shipmentId,
        mode,
        user,
      });

      return prisma.shipment.update({
        where: { shipmentId: s.shipmentId },   // hbl_Number stays unique per row
        data: {
          mbl_url: mblUrl,
          rawJson: mergedPayload,
          updated_by: user,
          updated_reason: 'MBL re-upload',
        },
      });
    });

    await prisma.$transaction(updates);          // atomic bulk update
    return res.status(200).json({
      success: true,
      message: `Updated ${updates.length} shipment(s) that share MBL ${mblNumber}.`,
    });
  }

  // —— No shipment yet uses this MBL ⇒ create the first one ——
  const shipmentId = `ocn-${uuidv4()}`;
  const shipmentPayload = build_shipment_json({
    mbl_rawJson: rawJson,
    shipmentId,
    mode,
    user,
  });

  await prisma.shipment.create({
    data: {
      shipmentId,
      mode,
      mbl_Number: mblNumber,          // NOT unique → many rows may share it
      mbl_url: mblUrl,
      rawJson: shipmentPayload,
    },
  });

  return res.status(201).json({
    success: true,
    message: `Shipment ${shipmentId} created with new MBL ${mblNumber}.`,
  });
    }

    /* ───────────────────────────  H B L   B R A N C H  ─────────────────────────── */
else if (fileType === 'hbl') {
  const hblNumber = rawJson.shipment.hbl_number;         // always unique
  const mblNumber = rawJson.shipment.mbl_number;         // may repeat
  const hblUrl    = await getDocUrl('hbl', fileId);      // URL of this HBL PDF

  /** 1️⃣  Do we already have a shipment row for this HBL?  */
  const existing = await prisma.shipment.findUnique({
    where: { hbl_Number: hblNumber },                    // works because @unique
  });

  /** 2️⃣  Try to locate the *document* for the related MBL (optional).   *
   *      Assumes mbl_Document.rawJson → { shipment: { mbl_number: … } } */
  const mblDoc = await prisma.mbl_Document.findFirst({
    where: {
      rawJson: {
        path: ['shipment', 'mbl_number'],
        equals: mblNumber,
      },
    },
    select: { file_Url: true, rawJson: true },
  });
  const mblUrl     = mblDoc?.file_Url ?? null;
  const mblRawJson = mblDoc?.rawJson as any | undefined;

  if (existing) {
    /* —— UPDATE the current row —— */
    const mergedPayload = build_shipment_json({
      mbl_rawJson: mblRawJson ?? existing.rawJson,   // keep old MBL part if no doc
      hbl_rawJson: rawJson,                          // new HBL data
      shipmentId:  existing.shipmentId,
      mode,
      user,
    });

    await prisma.shipment.update({
      where: { shipmentId: existing.shipmentId },
      data: {
        mbl_Number:  mblNumber,                      // refresh link
        mbl_url:     mblUrl ?? existing.mbl_url,
        hbl_url:     hblUrl,
        rawJson:     mergedPayload,
        updated_by:  user,
        updated_reason: 'HBL re-upload',
      },
    });

    return res.status(200).json({
      success: true,
      message: `Shipment ${existing.shipmentId} updated (HBL ${hblNumber}).`,
    });
  }

  /* —— CREATE a brand-new shipment row —— */
  const shipmentId = `ocn-${uuidv4()}`;

  const shipmentPayload = build_shipment_json({
    mbl_rawJson: mblRawJson,      // may be undefined if we have no MBL doc yet
    hbl_rawJson: rawJson,
    shipmentId,
    mode,
    user,
  });

  await prisma.shipment.create({
    data: {
      shipmentId,
      mode,
      mbl_Number:  mblNumber,     // one-to-many link
      mbl_url:     mblUrl,
      hbl_Number:  hblNumber,     // @unique
      hbl_url:     hblUrl,
      rawJson:     shipmentPayload,
    },
  });

  return res.status(201).json({
    success: true,
    message: `Shipment ${shipmentId} created with HBL ${hblNumber}.`,
  });
} 
/* ────────────────────────────────────────────────────────────────────────────── */

  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: err.message || 'Internal error' });
  }
}