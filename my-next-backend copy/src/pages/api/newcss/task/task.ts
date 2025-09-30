// pages/api/tasks.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // <-- adjust if you use "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("task.ts called")
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  const tasks = await prisma.Task.findMany({
    orderBy: { id: "asc" },
  });

  // API returns the exact shape your UI expects
  const rows = tasks.map(t => ({
    id: t.id,
    type: t.type,
    poNumber: t.poNumber,
    status: t.status as "Open" | "Completed",
    dueDate: t.dueDate,
  }));

  return res.status(200).json({ tasks: rows });
}
