import { z } from "zod";

export const createHealthRecordSchema = z.object({
  animalId: z.string(),
  date: z.coerce.date(),
  description: z.string().min(1),
  observation: z.string().optional(),
});
export type CreateHealthRecordDTO = z.infer<typeof createHealthRecordSchema>;

export const createVaccineSchema = z.object({
  animalId: z.string(),
  vaccineName: z.string().min(1),
  doseNumber: z.number().int().positive().default(1),
  dateAdministered: z.coerce.date(),
  nextDueDate: z.coerce.date().optional(),
});
export type CreateVaccineDTO = z.infer<typeof createVaccineSchema>;

export const createTreatmentSchema = z.object({
  animalId: z.string(),
  diagnosis: z.string().min(1),
  medication: z.string().min(1),
  dosage: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
});
export type CreateTreatmentDTO = z.infer<typeof createTreatmentSchema>;

export interface HealthRecord {
  id: string;
  animalId: string;
  date: Date;
  description: string;
  observation?: string | null;
  organizationId: string;
}

export interface VaccineRecord {
  id: string;
  animalId: string;
  vaccineName: string;
  doseNumber: number;
  dateAdministered: Date;
  nextDueDate?: Date | null;
  organizationId: string;
}

export interface TreatmentRecord {
  id: string;
  animalId: string;
  diagnosis: string;
  medication: string;
  dosage?: string | null;
  startDate: Date;
  endDate?: Date | null;
  organizationId: string;
}

export interface HealthSummary {
  activeTreatments: number;
  vaccinesDue: number;
}
