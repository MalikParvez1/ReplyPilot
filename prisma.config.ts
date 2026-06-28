import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Zieht sich jetzt dynamisch den PostgreSQL-Link aus deiner .env Datei
    url: process.env.DATABASE_URL as string, 
  },
});