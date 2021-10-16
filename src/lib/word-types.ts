import { WordType } from ".prisma/client";

const wordTypes: { [key in WordType]: { name: String } } = {
  NOUN: { name: "Substantiv" },
  VERB: { name: "Verb" },
  ARTICLE: { name: "Artikel" },
  ADJECTIVE: { name: "Adjektiv" },
  PRONOUN: { name: "Pronomen" },
  NUMERAL: { name: "Numerale" },
};

export default wordTypes;
