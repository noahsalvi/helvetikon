import type { WordGender } from "@prisma/client";

const wordGenders: {
  [key in WordGender]: { name: string };
} = {
  MASCULINE: {
    name: "Männlich",
  },
  FEMININE: {
    name: "Weiblich",
  },
  NEUTER: {
    name: "Sachlich",
  },
};

export default wordGenders;
