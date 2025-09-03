import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

console.log("delete all data called")

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }


  try {
    // Postgres-only. Lists all base tables in public schema except Prisma migrations.
    const rows = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename NOT IN ('_prisma_migrations')
    `;

    const tableNames = rows
      .map((r) => r.tablename)
      .filter(Boolean);

    if (tableNames.length === 0) {
      res.status(200).json({ truncatedTables: [], message: "No tables to truncate" });
      return;
    }

    // Quote identifiers and build TRUNCATE statement.
    const quoted = tableNames.map((t) => `"${t}"`).join(", ");
    const sql = `TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE;`;

    await prisma.$executeRawUnsafe(sql);

    res.status(200).json({ truncatedTables: tableNames });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to wipe database" });
  } finally {
    // Let Next manage connection pooling; avoid prisma.$disconnect() here.
  }
}
