import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

export class PrismaService {
  private static instance: PrismaClient;

  private static adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  private constructor() {}

  static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        adapter: PrismaService.adapter,
      });
    }
    return PrismaService.instance;
  }
}
