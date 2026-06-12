// src/lib/prisma.ts

import { PrismaClient } from "@prisma/client";


// In Prisma 7 nutzt man Adapter für die direkte Datenbankverbindung. 
// (Beispielhafter Import, schau ggf. in den Link aus deiner Fehlermeldung für das exakte Paket)
// import { PrismaLibSQL } from '@prisma/adapter-libsql'; 

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Hier wird in v7 die Verbindung hergestellt:
    // adapter: new PrismaLibSQL( ... ), 
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;