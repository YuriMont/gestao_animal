import type { Organization } from '@src/modules/core/domain/entities/organization.entity'

export interface IOrganizationRepository {
  create(organization: Organization): Promise<Organization>
  findById(id: string): Promise<Organization | null>
  list(): Promise<Organization[]>
  update(organization: Organization): Promise<Organization>
  delete(id: string): Promise<void>
}
