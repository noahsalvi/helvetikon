import prisma from "$lib/prisma";
import type { Dialect, Word } from "@prisma/client";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const { word, dialect }: { word: string; dialect: Dialect } = params as any;

  const wordsSwissGermanMatch: Word[] =
    await prisma.$queryRaw`select * from "Word" where "dialect" = ${dialect}::"Dialect" AND "swissGerman" = ${word}`;

  const wordsSpellingMatch: Word[] =
    await prisma.$queryRaw`select * from "Word" where "dialect" = ${dialect}::"Dialect" AND ${word} = any(spellings)`;

  const words = [...wordsSwissGermanMatch, ...wordsSpellingMatch];

  if (words.length) {
    return new Response(JSON.stringify(words[0]), {
      status: 409,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(word + " is available for " + dialect, { status: 200 });
};
