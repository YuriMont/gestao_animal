export interface WeightRecordProps {
  animalId: string;
  weight: number;
  date: Date;
  organizationId: string;
}

export class WeightRecord {
  constructor(
    public readonly props: WeightRecordProps,
    public readonly id?: string,
  ) {}

  public static create(props: WeightRecordProps, id?: string): WeightRecord {
    if (props.weight <= 0) throw new Error('Weight must be positive');
    return new WeightRecord(props, id);
  }
}
