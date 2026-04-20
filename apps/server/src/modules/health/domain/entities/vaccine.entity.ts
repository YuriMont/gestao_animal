export interface VaccineProps {
  animalId: string
  vaccineName: string
  doseNumber: number
  dateAdministered: Date
  nextDueDate?: Date
  organizationId: string
}

export class Vaccine {
  constructor(
    public readonly props: VaccineProps,
    public readonly id?: string
  ) {}

  public static create(props: VaccineProps, id?: string): Vaccine {
    if (!props.vaccineName) throw new Error('Vaccine name is required')
    return new Vaccine(props, id)
  }
}
