// pages/api/get/get_doc_detail.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { documentId, documentType } = req.body as {
    documentId: string;
    documentType: 'mbl' | 'hbl';
  };
  console.log("get_doc_detail.ts called")
  console.log("documentId", documentId)
  console.log("documentType", documentType)

  try {
    const record =
      documentType === 'mbl'
        ? await prisma.mbl_Document.findUnique({
            where: { id: parseInt(documentId) },
            select: { file_id: true, rawJson: true },
          })
        : await prisma.hbl_Document.findUnique({
            where: { id: parseInt(documentId) },
            select: { file_id: true, rawJson: true },
          });

    if (!record) return res.status(404).json({ error: 'Not found' });

    res.json({
      name: record.file_id,
      type: documentType.toUpperCase(), // MBL | HBL
      rawJson: record.rawJson,          // <- the useful bit
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}