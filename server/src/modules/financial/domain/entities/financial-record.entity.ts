export interface FinancialRecordProps {
  type: 'COST' | 'REVENUE';
  category: string;
  amount: number;
  date: Date;
  description?: string;
  organizationId: string;
}

export class FinancialRecord {
  constructor(
    public readonly props: FinancialRecordProps,
    public readonly id?: string,
  ) {}

  public static create(props: FinancialRecordProps, id?: string): FinancialRecord {
    if (props.amount < 0) throw new Error('Amount cannot be negative');
    return new FinancialRecord(props, id);
  }
}
