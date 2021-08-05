import userAnonym from "$lib/userAnonym";
import { PrismaClient, WordInterpretation } from "@prisma/client";
const prisma = new PrismaClient();

type WordInterpretationDraft = { meaning: string; examples: string[] };

// Create an interpretation
export async function post({ params, body }) {
  const wordId = parseInt(params.wordId);
  const newInterpretation: WordInterpretationDraft = JSON.parse(body);

  const interpretation = await prisma.wordInterpretation.create({
    data: {
      ...newInterpretation,
      word: { connect: { id: wordId } },
      createdBy: userAnonym,
    },
  });

  return {
    body: interpretation,
  };
}
