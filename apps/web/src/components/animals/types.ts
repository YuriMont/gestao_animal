import type { z } from "zod/v4";
import type { postV1AnimalsMutationRequestSchema } from "@/gen";

export type AnimalFormData = z.infer<typeof postV1AnimalsMutationRequestSchema>;
