export interface MilkProductionProps {
  animalId: string;
  quantity: number;
  unit: string;
  date: Date;
  organizationId: string;
}

export class MilkProduction {
  constructor(
    public readonly props: MilkProductionProps,
    public readonly id?: string,
  ) {}

  public static create(props: MilkProductionProps, id?: string): MilkProduction {
    if (props.quantity < 0) throw new Error('Production quantity cannot be negative');
    return new MilkProduction(props, id);
  }
}
