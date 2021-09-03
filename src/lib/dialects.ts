import { Dialect } from "$lib/prisma-browser";
import { Dialect as DialectType } from "@prisma/client";

const dialects: {
  [key in DialectType]: { name: string; description?: string };
} = {
  [Dialect.AARGAU]: {
    name: "Aargauerdeutsch",
  },
  [Dialect.BASEL]: {
    name: "Baseldeutsch",
  },
  [Dialect.BERN]: {
    name: "Berndeutsch",
  },
  [Dialect.GLARUS]: {
    name: "Glarnerdeutsch",
  },
  [Dialect.LUZERN]: {
    name: "Luzernerdeutsch",
  },
  [Dialect.OSTSCHWEIZ]: {
    name: "Ostschweizerdeutsch",
    description: "(Schaffhausen, Thurgau, St. Gallen, Appenzell, Chur)",
  },
  [Dialect.FREIBURG]: {
    name: "Senslerdeutsch",
    description: "Schweizer Mundart im Sensebezirk in Freiburg",
  },
  [Dialect.SOLOTHURN]: {
    name: "Solothurnerdeutsch",
  },
  [Dialect.URI]: {
    name: "Urschweizerisch",
    description: "(Uri, Schwyz, Ob- und Nidwalden)",
  },
  [Dialect.WALLIS]: {
    name: "Walliserdeutsch",
  },
  [Dialect.ZUERICH]: {
    name: "Zürichdeutsch",
  },
  [Dialect.OTHER]: {
    name: "Anderer",
  },
};

export default dialects;
