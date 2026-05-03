import z from "zod";

export const createAlertRuleSchema = z.object({
  name: z.string().min(1),
  condition: z.string().min(1),
  value: z.string().optional(),
});

export const alertRuleResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  condition: z.string(),
  value: z.string().optional(),
  organizationId: z.string(),
});

export type CreateAlertRuleDTO = z.infer<typeof createAlertRuleSchema>;
export type AlertRuleResponseDTO = z.infer<typeof alertRuleResponseSchema>;
