import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";

export async function put({ locals, body, params }) {
  authorize(locals);

  const wordId = parseInt(params.wordId);
  const comparative = body.comparative;
  const superlative = body.superlative;

  const word = await prisma.word.findUnique({
    where: { id: wordId },
    include: { grammar: true },
  });
  if (!word) return { status: 404, body: "Word not found" };
  if (word.grammar.adjectiveComparative && word.grammar.adjectiveSuperlative)
    return { status: 409, body: "Comparative and Superlative already set" };

  await prisma.word.update({
    where: { id: wordId },
    data: {
      grammar: {
        update: {
          adjectiveComparative: comparative,
          adjectiveSuperlative: superlative,
        },
      },
    },
  });

  return {
    body: "Adjective updated",
  };
}
