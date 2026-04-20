import { NotFoundError } from '@src/common/errors/app-error'
import type { Animal } from '@src/modules/core/domain/entities/animal.entity'
import type { IAnimalRepository } from '@src/modules/core/domain/repositories/animal.repository'

export class GetAnimalByIdUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(id: string, organizationId: string): Promise<Animal> {
    const animal = await this.animalRepository.findById(id, organizationId)
    if (!animal) throw new NotFoundError('Animal')
    return animal
  }
}
