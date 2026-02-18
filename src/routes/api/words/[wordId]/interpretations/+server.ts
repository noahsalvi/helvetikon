import prisma from "$lib/prisma";
import authorize from "$lib/api/middlewares/authorize";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

type MeaningDraft = { explanation: string; examples: string[] };

export const POST: RequestHandler = async ({ params, request, locals }) => {
  let user: ReturnType<typeof authorize>;
  try {
    user = authorize(locals);
  } catch (e: any) {
    if (e && typeof e === "object" && "status" in e) {
      return new Response(e.body, { status: e.status });
    }
    throw e;
  }

  const wordId = parseInt(params.wordId);
  const newMeanings: MeaningDraft[] = await request.json();

  const interpretation = await prisma.interpretation.create({
    data: {
      word: { connect: { id: wordId } },
      meanings: { createMany: { data: newMeanings, skipDuplicates: true } },
      createdBy: { connect: { id: user.id } },
    },
  });

  return json(interpretation);
};
