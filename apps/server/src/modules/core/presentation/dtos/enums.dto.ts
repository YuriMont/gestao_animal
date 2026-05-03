import z from "zod";

// Translation service - centralized
const TRANSLATIONS = {
  en: {
    role: {
      VET: "VET",
      MANAGER: "MANAGER",
      OPERATOR: "OPERATOR",
    },
    animalStatus: {
      ACTIVE: "ACTIVE",
      SOLD: "SOLD",
      DECEASED: "DECEASED",
      QUARANTINE: "QUARANTINE",
    },
    animalSex: {
      MALE: "MALE",
      FEMALE: "FEMALE",
    },
    species: {
      CATTLE: "CATTLE",
      SHEEP: "SHEEP",
      GOAT: "GOAT",
      HORSE: "HORSE",
      PIG: "PIG",
    },
    animalOrigin: {
      BORN_ON_FARM: "BORN_ON_FARM",
      PURCHASED: "PURCHASED",
      DONATED: "DONATED",
      EXTERNAL_TRANSFER: "EXTERNAL_TRANSFER",
      OTHER: "OTHER",
    },
    inseminationType: {
      NATURAL_MATING: "NATURAL_MATING",
      ARTIFICIAL_INSEMINATION: "ARTIFICIAL_INSEMINATION",
      EMBRYO_TRANSFER: "EMBRYO_TRANSFER",
    },
    pregnancyStatus: {
      PENDING: "PENDING",
      CONFIRMED: "CONFIRMED",
      COMPLETED: "COMPLETED",
      CANCELLED: "CANCELLED",
    },
    birthStatus: {
      ALIVE: "ALIVE",
      STILLBORN: "STILLBORN",
      ABORTED: "ABORTED",
    },
    financialType: {
      INCOME: "INCOME",
      EXPENSE: "EXPENSE",
    },
    financialCategory: {
      FEED: "FEED",
      MEDICATION: "MEDICATION",
      LABOR: "LABOR",
      MAINTENANCE: "MAINTENANCE",
      OTHER: "OTHER",
    },
    milkSession: {
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
    },
  },
  pt: {
    role: {
      VET: "VET",
      MANAGER: "GERENTE",
      OPERATOR: "OPERADOR",
    },
    animalStatus: {
      ACTIVE: "Ativo",
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
      STILLBORN: "Morto nascido",
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
  },
} as const;

export type Lang = "en" | "pt";

export const getEnumLabel = (
  enumName: string,
  key: string,
  lang: Lang = "en",
): string => {
  return (
    (
      TRANSLATIONS[lang]?.[enumName as keyof (typeof TRANSLATIONS)["en"]] as any
    )?.[key]?.toString() || key
  );
};

export type EnumDomain =
  | "animals"
  | "users"
  | "organizations"
  | "reproduction"
  | "production"
  | "financial"
  | "alerts";

export type EnumName =
  | "role"
  | "animalStatus"
  | "animalSex"
  | "species"
  | "animalOrigin"
  | "inseminationType"
  | "pregnancyStatus"
  | "birthStatus"
  | "financialType"
  | "financialCategory"
  | "treatmentStatus"
  | "vaccineStatus"
  | "milkSession";

export const DOMAIN_ENUM_MAP: Record<EnumDomain, EnumName[]> = {
  animals: ["animalStatus", "animalSex", "species", "animalOrigin"],
  users: ["role"],
  organizations: [],
  reproduction: ["pregnancyStatus", "birthStatus", "inseminationType"],
  production: ["financialType"],
  financial: ["financialType", "financialCategory"],
  alerts: [],
};

export const getEnumValues = (
  domain: EnumDomain,
  enumName: EnumName,
): { key: string; label: string }[] => {
  const values: string[] = [];

  if (domain === "animals") {
    if (enumName === "animalStatus") {
      values.push("ACTIVE", "SOLD", "DECEASED", "QUARANTINE");
    } else if (enumName === "animalSex") {
      values.push("MALE", "FEMALE");
    } else if (enumName === "species") {
      values.push("CATTLE", "SHEEP", "GOAT", "HORSE", "PIG");
    } else if (enumName === "animalOrigin") {
      values.push(
        "BORN_ON_FARM",
        "PURCHASED",
        "DONATED",
        "EXTERNAL_TRANSFER",
        "OTHER",
      );
    }
  } else if (domain === "users") {
    if (enumName === "role") {
      values.push("VET", "MANAGER", "OPERATOR");
    }
  } else if (domain === "reproduction") {
    if (enumName === "pregnancyStatus") {
      values.push("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED");
    } else if (enumName === "birthStatus") {
      values.push("ALIVE", "STILLBORN", "ABORTED");
    } else if (enumName === "inseminationType") {
      values.push(
        "NATURAL_MATING",
        "ARTIFICIAL_INSEMINATION",
        "EMBRYO_TRANSFER",
      );
    }
  } else if (domain === "production") {
    if (enumName === "financialType") {
      values.push("INCOME", "EXPENSE");
    } else if (enumName === "milkSession") {
      values.push("morning", "afternoon", "evening");
    }
  } else if (domain === "financial") {
    if (enumName === "financialType") {
      values.push("INCOME", "EXPENSE");
    } else if (enumName === "financialCategory") {
      values.push("FEED", "MEDICATION", "LABOR", "MAINTENANCE", "OTHER");
    }
  }

  return values.map((key) => ({
    key,
    label: getEnumLabel(enumName, key, "pt"),
  }));
};

export const enumResponseSchema = z.array(
  z.object({
    key: z.string(),
    label: z.string(),
  }),
);
