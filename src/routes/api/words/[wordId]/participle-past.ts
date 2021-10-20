import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";

export async function put({ params, body, locals }) {
  authorize(locals);
  const participlePast = body.participlePast;
  const wordId = parseInt(params.wordId);

  if (!participlePast) return { status: 404, body: "No value passed" };

  await prisma.word.update({
    where: { id: wordId },
    data: { grammar: { update: { verbParticiplePast: participlePast } } },
  });

  return {
    body: "Participle Past added",
  };
}
