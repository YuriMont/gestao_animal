import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { HealthController } from "./health.controller";
import { PrismaHealthRepository } from "./health.repository";
import { HealthService } from "./health.service";

const prisma = PrismaService.getInstance();
const healthRepo = new PrismaHealthRepository(prisma);
const healthService = new HealthService(healthRepo);

export const healthController = new HealthController(healthService);
