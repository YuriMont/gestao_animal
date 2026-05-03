import { FinancialCategory, FinancialType } from "@prisma/client";
import z from "zod";

export const createFinancialRecordSchema = z.object({
  type: z.enum(FinancialType),
  category: z.nativeEnum(FinancialCategory),
  amount: z.number().positive(),
  date: z.coerce.date().optional(),
  description: z.string().optional(),
});

export const financialRecordResponseSchema = z.object({
  id: z.string(),
  type: z.enum(FinancialType),
  category: z.enum(FinancialCategory),
  amount: z.number(),
  date: z.date(),
  description: z.string().optional(),
  organizationId: z.string(),
});

export const financialSummarySchema = z.object({
  totalRevenue: z.number(),
  totalCost: z.number(),
  balance: z.number(),
});

export type CreateFinancialRecordDTO = z.infer<
  typeof createFinancialRecordSchema
>;
export type FinancialRecordResponseDTO = z.infer<
  typeof financialRecordResponseSchema
>;
export type FinancialSummaryDTO = z.infer<typeof financialSummarySchema>;
