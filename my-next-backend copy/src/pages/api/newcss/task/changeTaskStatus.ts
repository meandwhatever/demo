// pages/api/changeTaskStatus.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type Body = {
  id: number | string;
  status: string; // "Open" | "Completed" (case-insensitive; also accepts "opened"/"complete")
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("changeTaskStatus.ts called")
  console.log("id: ", req.body.id)
  console.log("status: ", req.body.status)
  if (req.method !== "POST" && req.method !== "PATCH") {
    res.setHeader("Allow", "POST, PATCH");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const body: Body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const parsedId =
      typeof body.id === "string" ? Number.parseInt(body.id, 10) : body.id;

    if (!Number.isFinite(parsedId)) {
      return res.status(400).json({ error: "Invalid or missing id" });
    }


    if (body.status !== "Open" && body.status !== "Completed") {
      return res.status(400).json({ error: "Invalid status (use Open or Completed)" });
    }

    const updated = await prisma.Task.update({
      where: { id: parsedId as number },
      data: { status: body.status },
    });

    return res.status(200).json({
      task: {
        id: updated.id,
        type: updated.type,
        poNumber: updated.poNumber,
        status: updated.status,
        dueDate: updated.dueDate,
      },
    });
  } catch (err) {
    console.error("changeTaskStatus error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
