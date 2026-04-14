import type { Animal } from '@src/modules/core/domain/entities/animal.entity';

export interface IAnimalRepository {
  create(animal: Animal): Promise<Animal>;
  findById(id: string, organizationId: string): Promise<Animal | null>;
  findByTag(tag: string, organizationId: string): Promise<Animal | null>;
  listByOrganization(organizationId: string): Promise<Animal[]>;
  update(animal: Animal): Promise<Animal>;
  delete(id: string, organizationId: string): Promise<void>;
}
