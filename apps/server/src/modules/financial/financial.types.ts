import { FinancialCategory, FinancialType } from "@generated/prisma/client";
import { z } from "zod";

export const createFinancialRecordSchema = z.object({
  type: z.enum(FinancialType),
  category: z.nativeEnum(FinancialCategory),
  amount: z.number().positive(),
  date: z.coerce.date().optional(),
  description: z.string().optional(),
});
export type CreateFinancialRecordDTO = z.infer<
  typeof createFinancialRecordSchema
>;

export const updateFinancialRecordSchema = z.object({
  type: z.enum(FinancialType).optional(),
  category: z.nativeEnum(FinancialCategory).optional(),
  amount: z.number().positive().optional(),
  date: z.coerce.date().optional(),
  description: z.string().optional(),
});
export type UpdateFinancialRecordDTO = z.infer<
  typeof updateFinancialRecordSchema
>;

export interface FinancialRecordRecord {
  id: string;
  type: string;
  category: string;
  amount: number;
  date: Date;
  description?: string | null;
  organizationId: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalCost: number;
  balance: number;
}
