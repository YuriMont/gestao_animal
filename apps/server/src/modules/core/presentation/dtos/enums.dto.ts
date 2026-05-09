import z from "zod";

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

export const getEnumLabel = (enumName: string, key: string): string =>
  LABELS[enumName]?.[key] ?? key;

export const getEnumValues = (
  enumName: string,
): { key: string; label: string }[] =>
  Object.keys(LABELS[enumName] ?? {}).map((key) => ({
    key,
    label: getEnumLabel(enumName, key),
  }));

export const enumResponseSchema = z.array(
  z.object({ key: z.string(), label: z.string() }),
);

export const createTranslatedEnumSchema = <T extends Record<string, string>>(
  enumObj: T,
) =>
  z.object({
    key: z.enum(enumObj),
    label: z.string(),
  });
