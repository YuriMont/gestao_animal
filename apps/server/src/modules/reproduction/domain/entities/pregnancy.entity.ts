import type { PregnancyStatus } from "@prisma/client";

export interface PregnancyProps {
  animalId: string;
  detectedDate: Date;
  expectedDate?: Date;
  status: PregnancyStatus;
  organizationId: string;
}

export class Pregnancy {
  constructor(
    public readonly props: PregnancyProps,
    public readonly id?: string,
  ) {}

  public static create(props: PregnancyProps, id?: string): Pregnancy {
    return new Pregnancy(props, id);
  }
}
