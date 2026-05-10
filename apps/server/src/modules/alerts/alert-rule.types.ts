import { z } from "zod";

export const createAlertRuleSchema = z.object({
  name: z.string().min(1),
  condition: z.string().min(1),
  value: z.string().optional(),
});

export type CreateAlertRuleDTO = z.infer<typeof createAlertRuleSchema>;

export interface AlertRuleRecord {
  id: string;
  name: string;
  condition: string;
  value?: string | null;
  organizationId: string;
}
