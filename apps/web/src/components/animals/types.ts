import type { postV1AnimalsMutationRequestSchema } from "@/gen";
import type { z } from "zod/v4";

export type AnimalFormData = z.infer<typeof postV1AnimalsMutationRequestSchema>;
