export interface HealthRecordProps {
  animalId: string;
  date: Date;
  description: string;
  observation?: string;
  organizationId: string;
}

export class HealthRecord {
  constructor(
    public readonly props: HealthRecordProps,
    public readonly id?: string,
  ) {}

  public static create(props: HealthRecordProps, id?: string): HealthRecord {
    if (!props.description) throw new Error("Description is required");
    return new HealthRecord(props, id);
  }
}
