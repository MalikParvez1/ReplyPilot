// src/lib/prisma.ts
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

// 1. In Prisma 7 nimmt der Adapter einfach nur die URL an.
// Er kümmert sich im Hintergrund selbst um better-sqlite3!
const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db'
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Dem PrismaClient den Adapter übergeben
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter, 
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;