/**
 * Translations for all enum keys used in the API.
 * Single source of truth for Portuguese labels on the frontend.
 * Keep in sync with apps/server/src/modules/core/presentation/dtos/enums.dto.ts
 */

const LABELS: Record<string, Record<string, string>> = {
  role: {
    VET: "VET",
    MANAGER: "Gerente",
    OPERATOR: "Operador",
  },
  animalStatus: {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    SOLD: "Vendido",
    DECEASED: "Óbito",
    QUARANTINE: "Em quarentena",
  },
  animalSex: {
    MALE: "Macho",
    FEMALE: "Fêmea",
  },
  species: {
    CATTLE: "Bovino",
    SHEEP: "Ovino",
    GOAT: "Caprino",
    HORSE: "Equino",
    PIG: "Suíno",
  },
  animalOrigin: {
    BORN_ON_FARM: "Nascido na Fazenda",
    PURCHASED: "Comprado",
    DONATED: "Doado",
    EXTERNAL_TRANSFER: "Transferência Externa",
    OTHER: "Outro",
  },
  inseminationType: {
    NATURAL_MATING: "Monta Natural",
    ARTIFICIAL_INSEMINATION: "Inseminação Artificial",
    EMBRYO_TRANSFER: "Transferência de Embrião",
  },
  pregnancyStatus: {
    PENDING: "Pendente",
    CONFIRMED: "Confirmada",
    COMPLETED: "Concluída",
    CANCELLED: "Cancelada",
  },
  birthStatus: {
    ALIVE: "Vivo",
    STILLBORN: "Natimorto",
    ABORTED: "Abortado",
  },
  financialType: {
    INCOME: "Receita",
    EXPENSE: "Despesa",
  },
  financialCategory: {
    FEED: "Ração",
    MEDICATION: "Medicamento",
    LABOR: "Mão de obra",
    MAINTENANCE: "Manutenção",
    OTHER: "Outro",
  },
  milkSession: {
    morning: "Manhã",
    afternoon: "Tarde",
    evening: "Noite",
  },
};

/** Returns the Portuguese label for an enum key, or the key itself if not found. */
export function getEnumLabel(enumName: string, key: string): string {
  return LABELS[enumName]?.[key] ?? key;
}
