import prisma from "$lib/prisma";
import authorize from "$lib/api/middlewares/authorize";

type InterpretationDraft = { meaning: string; examples: string[] };

// Create an interpretation
export async function post({ params, body, locals }) {
  const user = authorize(locals);
  const wordId = parseInt(params.wordId);
  const newInterpretation: InterpretationDraft = body;

  const interpretation = await prisma.interpretation.create({
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
