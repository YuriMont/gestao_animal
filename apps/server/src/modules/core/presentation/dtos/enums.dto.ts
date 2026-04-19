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
  },
} as const;

export type Lang = "en" | "pt";

export const getEnumLabel = (
  enumName: string,
  key: string,
  lang: Lang = "en",
): string => {
  return (
    TRANSLATIONS[lang]?.[enumName as keyof (typeof TRANSLATIONS)["en"]]?.[
      key as keyof (typeof TRANSLATIONS)["en"]["role"]
    ]?.toString() || key
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
  | "pregnancyStatus"
  | "birthStatus"
  | "financialType"
  | "financialCategory"
  | "treatmentStatus"
  | "vaccineStatus";

export const DOMAIN_ENUM_MAP: Record<EnumDomain, EnumName[]> = {
  animals: ["animalStatus", "animalSex"],
  users: ["role"],
  organizations: [],
  reproduction: ["pregnancyStatus", "birthStatus"],
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
    }
  } else if (domain === "production") {
    if (enumName === "financialType") {
      values.push("INCOME", "EXPENSE");
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
