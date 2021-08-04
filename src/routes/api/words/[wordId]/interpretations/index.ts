import userAnonym from "$lib/userAnonym";
import { PrismaClient, WordInterpretation } from "@prisma/client";
const prisma = new PrismaClient();

// Create an interpretation
export async function post({ params, body }) {
  const wordId = parseInt(params.wordId);
  const newInterpretation: WordInterpretation = JSON.parse(body);

  const interpretation = await prisma.wordInterpretation.create({
    data: {
      word: { connect: { id: wordId } },
      meaning: newInterpretation.meaning,
      examples: newInterpretation.examples,
      createdBy: userAnonym,
    },
  });

  return {
    body: interpretation,
  };
}
