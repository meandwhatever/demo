// pages/api/getAllTask.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

declare global {
  // Avoid hot-reload instantiations in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();
console.log("getAllTask.ts called");
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const tasks = await prisma.Task.findMany({
      orderBy: { id: "asc" },
    });

    // Ensure dates are serializable strings
    const data = tasks.map(t => ({
      ...t,
      createdAt: t.createdAt?.toISOString?.() ?? t.createdAt,
    }));

    return res.status(200).json(data);
  } catch (err) {
    console.error("getAllTask error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
