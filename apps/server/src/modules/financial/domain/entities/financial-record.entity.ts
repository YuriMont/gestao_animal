import type { FinancialCategory, FinancialType } from '@prisma/client'

export interface FinancialRecordProps {
  type: FinancialType
  category: FinancialCategory
  amount: number
  date: Date
  description?: string
  organizationId: string
}

export class FinancialRecord {
  constructor(
    public readonly props: FinancialRecordProps,
    public readonly id?: string
  ) {}

  public static create(
    props: FinancialRecordProps,
    id?: string
  ): FinancialRecord {
    if (props.amount < 0) throw new Error('Amount cannot be negative')
    return new FinancialRecord(props, id)
  }
}
