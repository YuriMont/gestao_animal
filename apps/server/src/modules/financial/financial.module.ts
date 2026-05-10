import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { FinancialController } from "./financial.controller";
import { PrismaFinancialRepository } from "./financial.repository";
import { FinancialService } from "./financial.service";

const prisma = PrismaService.getInstance();
const financialRepo = new PrismaFinancialRepository(prisma);
const financialService = new FinancialService(financialRepo);

export const financialController = new FinancialController(financialService);
