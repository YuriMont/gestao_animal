import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { ParasiteMonitoringController } from "./parasitology.controller";
import { PrismaParasiteMonitoringRepository } from "./parasitology.repository";
import { ParasiteMonitoringService } from "./parasitology.service";

const prisma = PrismaService.getInstance();
const parasitologyRepo = new PrismaParasiteMonitoringRepository(prisma);
const parasitologyService = new ParasiteMonitoringService(parasitologyRepo);

export const parasitologyController = new ParasiteMonitoringController(
  parasitologyService,
);
