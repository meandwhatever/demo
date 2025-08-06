//for the recent documents page
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';        // adjust import if your client lives elsewhere

// A shared shape for the front-end table
export type DocumentRow = {
  id: number;
  date: string;            // ISO string for easy formatting on the client
  documentName: string;
  documentType: 'mbl' | 'hbl';
  documentUrl: string;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<DocumentRow[] | { error: string }>
) {
  try {
    // 🔎  Grab the newest N from *each* table in parallel
    const [mblRows, hblRows] = await Promise.all([
      prisma.mbl_Document.findMany({
        select: { id: true, uploadedAt: true, file_id: true, file_Url: true }, // ↞ use your exact column names
        orderBy: { uploadedAt: 'desc' },
        take: 5,
      }),
      prisma.hbl_Document.findMany({
        select: { id: true, uploadedAt: true, file_id: true, file_Url: true },
        orderBy: { uploadedAt: 'desc' },
        take: 5,
      }),
    ]);

    // 🧩  Normalise into a single array with a `documentType` flag
    const docs: DocumentRow[] = [
      ...mblRows.map((d) => ({
        id: d.id,
        date: d.uploadedAt.toISOString(),
        documentName: d.file_id,
        documentType: 'mbl' as const,
        documentUrl: d.file_Url,
      })),
      ...hblRows.map((d) => ({
        id: d.id,
        date: d.uploadedAt.toISOString(),
        documentName: d.file_id,
        documentType: 'hbl' as const,
        documentUrl: d.file_Url,
      })),
    ]
      .sort((a, b) => (a.date < b.date ? 1 : -1)) // newest first
      .slice(0, 5);                                // overall top-5

    res.status(200).json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load recent documents' });
  }
}