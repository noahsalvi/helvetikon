import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";

export async function get({ params, locals }) {
  authorize(locals);
  const interpretationId = parseInt(params.interpretationId);

  const interpretation = await prisma.interpretation.findUnique({
    where: { id: interpretationId },
    include: { word: true, meanings: true },
  });

  return {
    body: interpretation,
  };
}

type MeaningDraft = { explanation: string; examples: string };

export async function put({ params, locals, body }) {
  const user = authorize(locals);
  const interpretationId = parseInt(params.interpretationId);
  const meanings: MeaningDraft[] = body;
  // prisma can't create the meanings when these to fields are still on the object
  meanings.forEach((meaning: any) => {
    delete meaning.id;
    delete meaning.interpretationId;
  });

  const interpretation = await prisma.interpretation.findUnique({
    where: { id: interpretationId },
  });

  if (interpretation.createdByUserId !== user.id)
    return {
      status: 403,
      body: "You're not allowed to edit this interpretation",
    };

  const deleteMeanings = prisma.meaning.deleteMany({
    where: { interpretationId: interpretationId },
  });
  const createMeanings = prisma.interpretation.update({
    where: { id: interpretationId },
    data: {
      meanings: { createMany: { data: meanings, skipDuplicates: true } },
    },
  });

  const [_, newInterpretation] = await prisma.$transaction([
    deleteMeanings,
    createMeanings,
  ]);

  return { body: newInterpretation };
}
