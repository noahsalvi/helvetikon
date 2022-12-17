import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";
import { VerbConjucation } from "@prisma/client";

export async function post({ params, body, locals }) {
  const user = authorize(locals);

  const wordId = parseInt(params.wordId);
  const {
    present,
    conditionalI,
    conditionalII,
  }: {
    present?: VerbConjucation;
    conditionalI?: VerbConjucation;
    conditionalII?: VerbConjucation;
  } = body;

  if (!present && !conditionalI && !conditionalII)
    return {
      status: 400,
      body: "present, conditionalI and conditionalII empty",
    };

  await updateConjugations(
    wordId,
    user.id,
    present,
    conditionalI,
    conditionalII
  );

  return { status: 201, body: "Conjugations updated" };
}

async function updateConjugations(
  wordId: number,
  userId: number,
  present: VerbConjucation,
  conditionalI: VerbConjucation,
  conditionalII: VerbConjucation
) {
  const grammar = await prisma.grammar.update({
    where: { wordId },
    data: {
      verbPresent: {
        upsert: { create: { ...present }, update: { ...present } },
      },
      verbConditionalI: {
        upsert: { create: { ...conditionalI }, update: { ...conditionalI } },
      },
      verbConditionalII: {
        upsert: { create: { ...conditionalII }, update: { ...conditionalII } },
      },
    },
  });

  await prisma.verbConjugationHistory.createMany({
    data: [
      {
        sourceId: grammar.verbPresentId,
        createdById: userId,
        ...present,
      },
      {
        sourceId: grammar.verbConditionalIId,
        createdById: userId,
        ...conditionalI,
      },
      {
        sourceId: grammar.verbConditionalIIId,
        createdById: userId,
        ...conditionalII,
      },
      // Don't create history for non-existing word types
    ].filter((c) => c.sourceId),
  });
}
