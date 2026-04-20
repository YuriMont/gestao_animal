import type { AnimalSex, AnimalStatus } from 'generated/prisma'

export interface AnimalProps {
  tag: string
  species: string
  breed?: string
  sex: AnimalSex
  birthDate: Date
  origin?: string
  status: AnimalStatus
  organizationId: string
}

export class Animal {
  constructor(
    public readonly props: AnimalProps,
    public readonly id?: string
  ) {}

  public static create(props: AnimalProps, id?: string): Animal {
    // Domain validation: e.g., ensuring tag is not empty
    if (!props.tag) throw new Error('Animal tag is required')
    return new Animal(props, id)
  }

  public updateStatus(newStatus: AnimalStatus): Animal {
    return new Animal(
      {
        ...this.props,
        status: newStatus,
      },
      this.id
    )
  }
}
