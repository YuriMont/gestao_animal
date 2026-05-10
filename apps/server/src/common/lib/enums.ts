import { z } from "zod";

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
    DECEASED: "Obito",
    QUARANTINE: "Em quarentena",
  },
  animalSex: {
    MALE: "Macho",
    FEMALE: "Femea",
  },
  species: {
    CATTLE: "Bovino",
    SHEEP: "Ovino",
    GOAT: "Caprino",
    HORSE: "Equino",
    PIG: "Suino",
  },
  animalOrigin: {
    BORN_ON_FARM: "Nascido na Fazenda",
    PURCHASED: "Comprado",
    DONATED: "Doado",
    EXTERNAL_TRANSFER: "Transferencia Externa",
    OTHER: "Outro",
  },
  inseminationType: {
    NATURAL_MATING: "Monta Natural",
    ARTIFICIAL_INSEMINATION: "Inseminacao Artificial",
    EMBRYO_TRANSFER: "Transferencia de Embriao",
  },
  pregnancyStatus: {
    PENDING: "Pendente",
    CONFIRMED: "Confirmada",
    COMPLETED: "Concluida",
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
    FEED: "Racao",
    MEDICATION: "Medicamento",
    LABOR: "Mao de obra",
    MAINTENANCE: "Manutencao",
    OTHER: "Outro",
  },
  milkSession: {
    morning: "Manha",
    afternoon: "Tarde",
    evening: "Noite",
  },
};

export function getEnumLabel(enumName: string, key: string): string {
  return LABELS[enumName]?.[key] ?? key;
}

export function getEnumValues(
  enumName: string,
): { key: string; label: string }[] {
  return Object.keys(LABELS[enumName] ?? {}).map((key) => ({
    key,
    label: getEnumLabel(enumName, key),
  }));
}

export const enumResponseSchema = z.array(
  z.object({ key: z.string(), label: z.string() }),
);

export function createTranslatedEnumSchema<T extends Record<string, string>>(
  enumObj: T,
) {
  return z.object({
    key: z.enum(enumObj as unknown as [string, ...string[]]),
    label: z.string(),
  });
}

export const enumField = z.object({ key: z.string(), label: z.string() });
