import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const query = params.word;
  const dialect = params.dialect as any;

  const word: any = await prisma.word.findFirst({
    where: {
      AND: { swissGerman: { equals: query }, dialect: { equals: dialect } },
    },
    include: {
      createdBy: { select: { username: true } },
      audioSamples: { orderBy: { createdAt: "desc" } },
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
    return new Response("Could not find word " + query, { status: 404 });
  }

  word.interpretations.sort(
    (a, b) =>
      b.upvotes.length -
      b.downvotes.length -
      (a.upvotes.length - a.downvotes.length)
  );

  return json(word);
};
