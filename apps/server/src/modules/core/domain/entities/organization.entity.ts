export interface OrganizationProps {
  name: string
  createdAt: Date
  updatedAt: Date
}

export class Organization {
  constructor(
    public readonly props: OrganizationProps,
    public readonly id?: string
  ) {}

  public static create(props: OrganizationProps, id?: string): Organization {
    if (!props.name) throw new Error('Organization name is required')
    return new Organization(props, id)
  }
}
