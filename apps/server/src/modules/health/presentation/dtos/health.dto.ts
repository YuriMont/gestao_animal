import z from "zod";

export const createHealthRecordSchema = z.object({
  animalId: z.string(),
  date: z.coerce.date(),
  description: z.string().min(1),
  observation: z.string().optional(),
});

export const healthRecordResponseSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  date: z.date(),
  description: z.string(),
  observation: z.string().optional(),
  organizationId: z.string(),
});

export const createVaccineSchema = z.object({
  animalId: z.string(),
  vaccineName: z.string().min(1),
  doseNumber: z.number().int().positive().default(1),
  dateAdministered: z.coerce.date(),
  nextDueDate: z.coerce.date().optional(),
});

export const vaccineResponseSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  vaccineName: z.string(),
  doseNumber: z.number(),
  dateAdministered: z.date(),
  nextDueDate: z.date().optional(),
  organizationId: z.string(),
});

export const createTreatmentSchema = z.object({
  animalId: z.string(),
  diagnosis: z.string().min(1),
  medication: z.string().min(1),
  dosage: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
});

export const treatmentResponseSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  diagnosis: z.string(),
  medication: z.string(),
  dosage: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  organizationId: z.string(),
});

export type CreateHealthRecordDTO = z.infer<typeof createHealthRecordSchema>;
export type HealthRecordResponseDTO = z.infer<
  typeof healthRecordResponseSchema
>;
export type CreateVaccineDTO = z.infer<typeof createVaccineSchema>;
export type VaccineResponseDTO = z.infer<typeof vaccineResponseSchema>;
export type CreateTreatmentDTO = z.infer<typeof createTreatmentSchema>;
export type TreatmentResponseDTO = z.infer<typeof treatmentResponseSchema>;
