import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function get({ params }) {
  const query = params.word;

  const word = await prisma.word.findUnique({
    include: {
      createdBy: { select: { username: true } },
      interpretations: {
        orderBy: { updatedAt: "desc" },
        include: {
          createdBy: { select: { username: true } },
          upvotes: { select: { username: true } },
          downvotes: { select: { username: true } },
        },
      },
    },
    where: { swissGerman: query },
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
