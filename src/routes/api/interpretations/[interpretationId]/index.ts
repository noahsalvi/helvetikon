import authorize from "../../_middlewares/authorize";
import prisma from "$lib/prisma";

export async function get({ params, locals }) {
  authorize(locals);
  const interpretationId = parseInt(params.interpretationId);

  const interpretation = await prisma.wordInterpretation.findUnique({
    where: { id: interpretationId },
    include: { word: true },
  });

  return {
    body: interpretation,
  };
}

export async function put({ params, locals, body }) {
  const user = authorize(locals);
  const interpretationId = parseInt(params.interpretationId);
  const { meaning, examples } = body;

  const interpretation = await prisma.wordInterpretation.findUnique({
    where: { id: interpretationId },
  });

  if (interpretation.createdByUserId !== user.id)
    return {
      status: 403,
      body: "You're not allowed to edit this interpretation",
    };

  const updatedInterpretation = await prisma.wordInterpretation.update({
    where: { id: interpretationId },
    data: { meaning, examples },
  });

  return { body: updatedInterpretation };
}
