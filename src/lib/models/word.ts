import type {
  Example,
  Meaning,
  Spelling,
  Word as WordModel,
} from "@prisma/client";

export type Word = WordModel & {
  examples: Example[];
  meanings: Meaning[];
  spellings: Spelling[];
};
