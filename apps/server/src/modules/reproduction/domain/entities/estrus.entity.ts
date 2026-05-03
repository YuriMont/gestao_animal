export interface EstrusProps {
  animalId: string;
  startDate: Date;
  endDate?: Date;
  observation?: string;
  organizationId: string;
}

export class Estrus {
  constructor(
    public readonly props: EstrusProps,
    public readonly id?: string,
  ) {}

  public static create(props: EstrusProps, id?: string): Estrus {
    return new Estrus(props, id);
  }
}
