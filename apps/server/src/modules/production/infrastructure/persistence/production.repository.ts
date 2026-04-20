import type { PrismaClient } from '@prisma/client'
import { MilkProduction } from '@src/modules/production/domain/entities/milk-production.entity'
import { WeightRecord } from '@src/modules/production/domain/entities/weight-record.entity'
import type { IProductionRepository } from '@src/modules/production/domain/repositories/production.repository'

export class PrismaProductionRepository implements IProductionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createWeight(record: WeightRecord): Promise<WeightRecord> {
    const created = await this.prisma.weightRecord.create({
      data: {
        animalId: record.props.animalId,
        weight: record.props.weight,
        date: record.props.date,
        organizationId: record.props.organizationId,
      },
    })
    return WeightRecord.create({ ...record.props }, created.id)
  }

  async createMilk(production: MilkProduction): Promise<MilkProduction> {
    const created = await this.prisma.milkProduction.create({
      data: {
        animalId: production.props.animalId,
        quantity: production.props.quantity,
        unit: production.props.unit,
        date: production.props.date,
        organizationId: production.props.organizationId,
      },
    })
    return MilkProduction.create({ ...production.props }, created.id)
  }

  async getAnimalMetrics(animalId: string, organizationId: string) {
    const [weights, milk] = await Promise.all([
      this.prisma.weightRecord.findMany({
        where: { animalId, organizationId },
        orderBy: { date: 'asc' },
      }),
      this.prisma.milkProduction.findMany({
        where: { animalId, organizationId },
        orderBy: { date: 'asc' },
      }),
    ])

    return {
      weights: weights.map(w =>
        WeightRecord.create(
          {
            animalId: w.animalId,
            weight: w.weight,
            date: w.date,
            organizationId: w.organizationId,
          },
          w.id
        )
      ),
      milk: milk.map(m =>
        MilkProduction.create(
          {
            animalId: m.animalId,
            quantity: m.quantity,
            unit: m.unit,
            date: m.date,
            organizationId: m.organizationId,
          },
          m.id
        )
      ),
    }
  }
}
