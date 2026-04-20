import type { Birth } from '@src/modules/reproduction/domain/entities/birth.entity'
import type { Estrus } from '@src/modules/reproduction/domain/entities/estrus.entity'
import type { Pregnancy } from '@src/modules/reproduction/domain/entities/pregnancy.entity'

export interface IReproductionRepository {
  createEstrus(estrus: Estrus): Promise<Estrus>
  createPregnancy(pregnancy: Pregnancy): Promise<Pregnancy>
  createBirth(birth: Birth): Promise<Birth>

  findPregnanciesByOrganization(organizationId: string): Promise<Pregnancy[]>
  findReproductionHistoryByAnimal(
    animalId: string,
    organizationId: string
  ): Promise<{
    estrus: Estrus[]
    pregnancies: Pregnancy[]
    births: Birth[]
  }>
}
