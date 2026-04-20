export interface BirthProps {
  motherId: string
  fatherId?: string
  birthDate: Date
  offspringTag?: string
  status: string
  organizationId: string
}

export class Birth {
  constructor(
    public readonly props: BirthProps,
    public readonly id?: string
  ) {}

  public static create(props: BirthProps, id?: string): Birth {
    return new Birth(props, id)
  }
}
