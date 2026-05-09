import { PrismaClient } from "@generated/prisma/client";
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL || "postgresql://user:password@localhost/db"}`;

const adapter = new PrismaPg({ connectionString });

export class PrismaService {
  private static instance: PrismaClient;

  private constructor() {}

  static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        adapter,
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      });
    }
    return PrismaService.instance;
  }
}
