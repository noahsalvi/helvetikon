import { WordType } from ".prisma/client";

const wordTypes: { [key in WordType]: { name: string } } = {
  NOUN: { name: "Substantiv" },
  VERB: { name: "Verb" },
  ARTICLE: { name: "Artikel" },
  ADJECTIVE: { name: "Adjektiv" },
  PRONOUN: { name: "Pronomen" },
  NUMERAL: { name: "Numerale" },
  PARTICLE: { name: "Partikel" },
};

export default wordTypes;
