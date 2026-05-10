import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { AlertRuleController } from "./alert-rule.controller";
import { PrismaAlertRuleRepository } from "./alert-rule.repository";
import { AlertRuleService } from "./alert-rule.service";

const prisma = PrismaService.getInstance();
const alertRuleRepo = new PrismaAlertRuleRepository(prisma);
const alertRuleService = new AlertRuleService(alertRuleRepo);

export const alertRuleController = new AlertRuleController(alertRuleService);
