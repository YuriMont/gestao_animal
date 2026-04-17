import type { PrismaClient } from "@prisma/client";
import { Animal } from "@src/modules/core/domain/entities/animal.entity";
import type {
	AnimalFilters,
	IAnimalRepository,
	PaginatedAnimals,
} from "@src/modules/core/domain/repositories/animal.repository";

function toEntity(a: any): Animal {
	return Animal.create(
		{
			tag: a.tag,
			species: a.species,
			breed: a.breed ?? undefined,
			sex: a.sex,
			birthDate: a.birthDate,
			origin: a.origin ?? undefined,
			status: a.status,
			organizationId: a.organizationId,
		},
		a.id,
	);
}

export class PrismaAnimalRepository implements IAnimalRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async create(animal: Animal): Promise<Animal> {
		const created = await this.prisma.animal.create({
			data: {
				tag: animal.props.tag,
				species: animal.props.species,
				breed: animal.props.breed ?? undefined,
				sex: animal.props.sex,
				birthDate: animal.props.birthDate,
				origin: animal.props.origin ?? undefined,
				status: animal.props.status,
				organizationId: animal.props.organizationId,
			},
		});
		return toEntity(created);
	}

	async findById(id: string, organizationId: string): Promise<Animal | null> {
		const animal = await this.prisma.animal.findFirst({
			where: { id, organizationId },
		});
		return animal ? toEntity(animal) : null;
	}

	async findByTag(tag: string, organizationId: string): Promise<Animal | null> {
		const animal = await this.prisma.animal.findFirst({
			where: { tag, organizationId },
		});
		return animal ? toEntity(animal) : null;
	}

	async listByOrganization(
		organizationId: string,
		filters: AnimalFilters = {},
	): Promise<PaginatedAnimals> {
		const { page = 1, limit = 20, status, species, sex } = filters;
		const skip = (page - 1) * limit;

		const where = {
			organizationId,
			...(status && { status }),
			...(species && { species }),
			...(sex && { sex }),
		};

		const [animals, total] = await this.prisma.$transaction([
			this.prisma.animal.findMany({
				where,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			this.prisma.animal.count({ where }),
		]);

		return {
			animals: animals.map(toEntity),
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	async update(animal: Animal): Promise<Animal> {
		const updated = await this.prisma.animal.update({
			where: { id: animal.id! },
			data: {
				tag: animal.props.tag,
				species: animal.props.species,
				breed: animal.props.breed ?? undefined,
				sex: animal.props.sex,
				birthDate: animal.props.birthDate,
				origin: animal.props.origin ?? undefined,
				status: animal.props.status,
			},
		});
		return toEntity(updated);
	}

	async delete(id: string, organizationId: string): Promise<void> {
		await this.prisma.animal.delete({ where: { id, organizationId } });
	}
}
