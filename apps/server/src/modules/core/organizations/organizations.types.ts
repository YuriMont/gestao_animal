import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(3),
});
export type CreateOrganizationDTO = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = z.object({
  name: z.string().min(3),
});
export type UpdateOrganizationDTO = z.infer<typeof updateOrganizationSchema>;

export interface OrganizationRecord {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const organizationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
