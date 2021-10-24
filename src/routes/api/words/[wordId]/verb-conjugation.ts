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

  prisma.grammar
    .update({
      where: { wordId },
      data: {
        verbPresent: {
          update: {
            firstPerson: present.firstPerson,
            secondPerson: present.secondPerson,
            thirdPerson: present.thirdPerson,
            firstPersonPlural: present.firstPersonPlural,
            secondPersonPlural: present.secondPersonPlural,
            thirdPersonPlural: present.thirdPersonPlural,
          },
        },
      },
    })
    .then((grammar) =>
      prisma.verbConjugationHistory.create({
        include: { source: true },
        data: {
          sourceId: grammar.verbPresentId,
          createdById: user.id,

          firstPerson: present.firstPerson,
          secondPerson: present.secondPerson,
          thirdPerson: present.thirdPerson,
          firstPersonPlural: present.firstPersonPlural,
          secondPersonPlural: present.secondPersonPlural,
          thirdPersonPlural: present.thirdPersonPlural,
        },
      })
    );
  prisma.grammar
    .update({
      where: { wordId },
      data: {
        verbConditionalI: {
          update: {
            firstPerson: present.firstPerson,
            secondPerson: present.secondPerson,
            thirdPerson: present.thirdPerson,
            firstPersonPlural: present.firstPersonPlural,
            secondPersonPlural: present.secondPersonPlural,
            thirdPersonPlural: present.thirdPersonPlural,
          },
        },
      },
    })
    .then((grammar) =>
      prisma.verbConjugationHistory.create({
        include: { source: true },
        data: {
          sourceId: grammar.verbConditionalIId,
          createdById: user.id,

          firstPerson: present.firstPerson,
          secondPerson: present.secondPerson,
          thirdPerson: present.thirdPerson,
          firstPersonPlural: present.firstPersonPlural,
          secondPersonPlural: present.secondPersonPlural,
          thirdPersonPlural: present.thirdPersonPlural,
        },
      })
    );
}
