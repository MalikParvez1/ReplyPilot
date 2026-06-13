// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Beide Systeme müssen auf dieselbe Datei zeigen!
    url: "file:./prisma/dev.db", 
  },
});