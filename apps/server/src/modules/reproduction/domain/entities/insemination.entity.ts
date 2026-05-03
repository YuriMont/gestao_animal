import type { InseminationType } from "@prisma/client";

export interface InseminationProps {
  animalId: string;
  type: InseminationType;
  date: Date;
  fatherId?: string;
  semenBatch?: string;
  success?: boolean;
  organizationId: string;
}

export class Insemination {
  constructor(
    public readonly props: InseminationProps,
    public readonly id?: string,
  ) {}

  public static create(props: InseminationProps, id?: string): Insemination {
    return new Insemination(props, id);
  }
}
