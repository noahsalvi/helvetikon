import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";

export async function put({ params, body, locals }) {
  authorize(locals);

  const wordId = parseInt(params.wordId);
  const nounPlural = body.nounPlural;
  if (!nounPlural) return { status: 404, body: "No noun plural passed" };

  const word = await prisma.word.update({
    where: { id: wordId },
    include: { grammar: true },
    data: { grammar: { update: { nounPlural } } },
  });

  if (!word) return { status: 404, body: "Did not find word" };

  return { body: "Noun plural updated!" };
}
