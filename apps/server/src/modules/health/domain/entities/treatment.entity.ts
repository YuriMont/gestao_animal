export interface TreatmentProps {
  animalId: string
  diagnosis: string
  medication: string
  dosage?: string
  startDate: Date
  endDate?: Date
  organizationId: string
}

export class Treatment {
  constructor(
    public readonly props: TreatmentProps,
    public readonly id?: string
  ) {}

  public static create(props: TreatmentProps, id?: string): Treatment {
    if (!props.diagnosis || !props.medication)
      throw new Error('Diagnosis and medication are required')
    return new Treatment(props, id)
  }
}
