import { Animal } from '@src/modules/core/domain/entities/animal.entity';
import type { IAnimalRepository } from '@src/modules/core/domain/repositories/animal.repository';

export class CreateAnimalUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(data: any, organizationId: string): Promise<Animal> {
    // 1. Check if animal with same tag already exists in this organization
    const existing = await this.animalRepository.findByTag(data.tag, organizationId);
    if (existing) {
      throw new Error('Animal with this tag already exists in the organization');
    }

    // 2. Create domain entity
    const animal = Animal.create({
      ...data,
      organizationId,
    });

    // 3. Persist
    return this.animalRepository.create(animal);
  }
}
