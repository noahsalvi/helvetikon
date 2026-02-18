import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, locals }) => {
  try {
    authorize(locals);
  } catch (e: any) {
    if (e && typeof e === "object" && "status" in e) {
      return new Response(e.body, { status: e.status });
    }
    throw e;
  }

  const interpretationId = parseInt(params.interpretationId);

  const interpretation = await prisma.interpretation.findUnique({
    where: { id: interpretationId },
    include: { word: true, meanings: true },
  });

  return json(interpretation);
};

type MeaningDraft = { explanation: string; examples: string[] };

export const PUT: RequestHandler = async ({ params, locals, request }) => {
  let user: ReturnType<typeof authorize>;
  try {
    user = authorize(locals);
  } catch (e: any) {
    if (e && typeof e === "object" && "status" in e) {
      return new Response(e.body, { status: e.status });
    }
    throw e;
  }

  const interpretationId = parseInt(params.interpretationId);
  const meanings: MeaningDraft[] = await request.json();

  meanings.forEach((meaning: any) => {
    delete meaning.id;
    delete meaning.interpretationId;
  });

  const interpretation = await prisma.interpretation.findUnique({
    where: { id: interpretationId },
  });

  if (!interpretation) {
    return new Response("Interpretation not found", { status: 404 });
  }

  if (interpretation.createdByUserId !== user.id) {
    return new Response("You're not allowed to edit this interpretation", {
      status: 403,
    });
  }

  const deleteMeanings = prisma.meaning.deleteMany({
    where: { interpretationId },
  });
  const createMeanings = prisma.interpretation.update({
    where: { id: interpretationId },
    data: {
      meanings: { createMany: { data: meanings, skipDuplicates: true } },
    },
  });

  const [, newInterpretation] = await prisma.$transaction([
    deleteMeanings,
    createMeanings,
  ]);

  return json(newInterpretation);
};
