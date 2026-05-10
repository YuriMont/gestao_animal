import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { ProductionController } from "./production.controller";
import { PrismaProductionRepository } from "./production.repository";
import { ProductionService } from "./production.service";

const prisma = PrismaService.getInstance();
const productionRepo = new PrismaProductionRepository(prisma);
const productionService = new ProductionService(productionRepo);

export const productionController = new ProductionController(productionService);
