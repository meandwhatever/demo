// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// ‼️  Prevent creating a new client on every hot-reload in dev
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'], // drop to [] in production if you like
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;