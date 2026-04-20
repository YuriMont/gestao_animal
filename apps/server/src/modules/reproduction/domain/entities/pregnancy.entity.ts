export interface PregnancyProps {
  animalId: string
  detectedDate: Date
  expectedDate?: Date
  status: string
  organizationId: string
}

export class Pregnancy {
  constructor(
    public readonly props: PregnancyProps,
    public readonly id?: string
  ) {}

  public static create(props: PregnancyProps, id?: string): Pregnancy {
    return new Pregnancy(props, id)
  }
}
