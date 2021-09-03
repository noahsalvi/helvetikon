import { Dialect } from "$lib/prisma-browser";
import { Dialect as DialectType } from "@prisma/client";

const dialects: {
  [key in DialectType]: { name: string; slug: string; description?: string };
} = {
  [Dialect.AARGAU]: {
    name: "Aargauerdeutsch",
    slug: "aargau",
  },
  [Dialect.BASEL]: {
    name: "Baseldeutsch",
    slug: "basel",
  },
  [Dialect.BERN]: {
    name: "Berndeutsch",
    slug: "bern",
  },
  [Dialect.GLARUS]: {
    name: "Glarnerdeutsch",
    slug: "glarus",
  },
  [Dialect.LUZERN]: {
    name: "Luzernerdeutsch",
    slug: "luzern",
  },
  [Dialect.OSTSCHWEIZ]: {
    name: "Ostschweizerdeutsch",
    description: "(Schaffhausen, Thurgau, St. Gallen, Appenzell, Chur)",
    slug: "ostschweiz",
  },
  [Dialect.FREIBURG]: {
    name: "Senslerdeutsch",
    description: "Schweizer Mundart im Sensebezirk in Freiburg",
    slug: "sense",
  },
  [Dialect.SOLOTHURN]: {
    name: "Solothurnerdeutsch",
    slug: "solothurn",
  },
  [Dialect.URI]: {
    name: "Urschweizerisch",
    slug: "uri",
    description: "(Uri, Schwyz, Ob- und Nidwalden)",
  },
  [Dialect.WALLIS]: {
    name: "Walliserdeutsch",
    slug: "wallis",
  },
  [Dialect.ZUERICH]: {
    name: "Zürichdeutsch",
    slug: "zürich",
  },
  [Dialect.OTHER]: {
    name: "Anderer",
    slug: "unbekannt",
  },
};

export default dialects;
