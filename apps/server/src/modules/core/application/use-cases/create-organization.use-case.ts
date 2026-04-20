import { Organization } from '@src/modules/core/domain/entities/organization.entity'
import type { IOrganizationRepository } from '@src/modules/core/domain/repositories/organization.repository'

export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository
  ) {}

  async execute(data: any): Promise<Organization> {
    const organization = Organization.create(data)
    return this.organizationRepository.create(organization)
  }
}
