import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { ReproductionController } from "./reproduction.controller";
import { PrismaReproductionRepository } from "./reproduction.repository";
import { ReproductionService } from "./reproduction.service";

const prisma = PrismaService.getInstance();
const reproductionRepo = new PrismaReproductionRepository(prisma);
const reproductionService = new ReproductionService(reproductionRepo);

export const reproductionController = new ReproductionController(
  reproductionService,
);
