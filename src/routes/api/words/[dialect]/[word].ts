import prisma from "$lib/prisma";

export async function get({ params }) {
  const query = params.word;
  const dialect = params.dialect;

  const word = await prisma.word.findFirst({
    where: {
      AND: { swissGerman: { equals: query }, dialect: { equals: dialect } },
    },
    include: {
      createdBy: { select: { username: true } },
      audioSamples: { orderBy: { createdAt: "desc" } },
      grammar: {
        include: {
          verbPresent: true,
          verbConditionalI: true,
          verbConditionalII: true,
        },
      },
      interpretations: {
        orderBy: { updatedAt: "desc" },
        include: {
          createdBy: { select: { username: true } },
          upvotes: { select: { username: true } },
          downvotes: { select: { username: true } },
          meanings: true,
        },
      },
    },
  });

  if (!word) {
    return { status: "404", body: "Could not find word " + query };
  }

  // Sort after score
  word.interpretations.sort(
    (a, b) =>
      b.upvotes.length -
      b.downvotes.length -
      (a.upvotes.length - a.downvotes.length)
  );

  return {
    body: word,
  };
}
