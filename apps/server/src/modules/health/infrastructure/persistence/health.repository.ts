import type { PrismaClient } from "@prisma/client";
import { HealthRecord } from "@src/modules/health/domain/entities/health-record.entity";
import { Treatment } from "@src/modules/health/domain/entities/treatment.entity";
import { Vaccine } from "@src/modules/health/domain/entities/vaccine.entity";
import type { IHealthRepository } from "@src/modules/health/domain/repositories/health.repository";

export class PrismaHealthRepository implements IHealthRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async createRecord(record: HealthRecord): Promise<HealthRecord> {
		const created = await this.prisma.healthRecord.create({
			data: {
				animalId: record.props.animalId,
				date: record.props.date,
				description: record.props.description,
				observation: record.props.observation ?? undefined,
				organizationId: record.props.organizationId,
			},
		});
		return HealthRecord.create({ ...record.props }, created.id);
	}

	async createVaccine(vaccine: Vaccine): Promise<Vaccine> {
		const created = await this.prisma.vaccine.create({
			data: {
				animalId: vaccine.props.animalId,
				vaccineName: vaccine.props.vaccineName,
				doseNumber: vaccine.props.doseNumber,
				dateAdministered: vaccine.props.dateAdministered,
				nextDueDate: vaccine.props.nextDueDate ?? undefined,
				organizationId: vaccine.props.organizationId,
			},
		});
		return Vaccine.create({ ...vaccine.props }, created.id);
	}

	async createTreatment(treatment: Treatment): Promise<Treatment> {
		const created = await this.prisma.treatment.create({
			data: {
				animalId: treatment.props.animalId,
				diagnosis: treatment.props.diagnosis,
				medication: treatment.props.medication,
				dosage: treatment.props.dosage,
				startDate: treatment.props.startDate,
				endDate: treatment.props.endDate ?? undefined,
				organizationId: treatment.props.organizationId,
			},
		});
		return Treatment.create({ ...treatment.props }, created.id);
	}

	async findByAnimal(animalId: string, organizationId: string) {
		const [records, vaccines, treatments] = await Promise.all([
			this.prisma.healthRecord.findMany({
				where: { animalId, organizationId },
			}),
			this.prisma.vaccine.findMany({ where: { animalId, organizationId } }),
			this.prisma.treatment.findMany({ where: { animalId, organizationId } }),
		]);

		return {
			records: records.map((r) =>
				HealthRecord.create(
					{
						animalId: r.animalId,
						date: r.date,
						description: r.description,
						observation: r.observation ?? undefined,
						organizationId: r.organizationId,
					},
					r.id,
				),
			),
			vaccines: vaccines.map((v) =>
				Vaccine.create(
					{
						animalId: v.animalId,
						vaccineName: v.vaccineName,
						doseNumber: v.doseNumber,
						dateAdministered: v.dateAdministered,
						nextDueDate: v.nextDueDate ?? undefined,
						organizationId: v.organizationId,
					},
					v.id,
				),
			),
			treatments: treatments.map((t) =>
				Treatment.create(
					{
						animalId: t.animalId,
						diagnosis: t.diagnosis,
						medication: t.medication,
						dosage: t.dosage,
						startDate: t.startDate,
						endDate: t.endDate ?? undefined,
						organizationId: t.organizationId,
					},
					t.id,
				),
			),
		};
	}
}
