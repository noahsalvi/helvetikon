import prisma from "$lib/prisma";
import authorize from "$lib/api/middlewares/authorize";

type MeaningDraft = { explanation: string; examples: string[] };

// Create an interpretation
export async function post({ params, body, locals }) {
  const user = authorize(locals);
  const wordId = parseInt(params.wordId);
  const newMeanings: MeaningDraft[] = body;

  const interpretation = await prisma.interpretation.create({
    data: {
      word: { connect: { id: wordId } },
      meanings: { createMany: { data: newMeanings, skipDuplicates: true } },
      createdBy: { connect: { id: user.id } },
    },
  });

  return {
    body: interpretation,
  };
}
