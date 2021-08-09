import prisma from "$lib/prisma";
import authorize from "../../../_middlewares/authorize";

type WordInterpretationDraft = { meaning: string; examples: string[] };

// Create an interpretation
export async function post({ params, body, locals }) {
  const user = authorize(locals);
  const wordId = parseInt(params.wordId);
  const newInterpretation: WordInterpretationDraft = body;

  const interpretation = await prisma.wordInterpretation.create({
    data: {
      ...newInterpretation,
      word: { connect: { id: wordId } },
      createdBy: { connect: { id: user.id } },
    },
  });

  return {
    body: interpretation,
  };
}
