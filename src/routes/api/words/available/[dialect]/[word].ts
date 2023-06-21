import prisma from "$lib/prisma";
import type { Dialect, Word } from "@prisma/client";

export async function get({ params }) {
  const { word, dialect }: { word: string; dialect: Dialect } = params;

  const wordsSwissGermanMatch: Word[] =
    await prisma.$queryRaw`select * from "Word" where "dialect" = ${dialect} AND "swissGerman" = ${word}`;

  const wordsSpellingMatch: Word[] =
    await prisma.$queryRaw`select * from "Word" where "dialect" = ${dialect} AND ${word} = any(spellings)`;

  const words = [...wordsSwissGermanMatch, ...wordsSpellingMatch];

  if (words.length) return { status: 409, body: words[0] };

  return {
    body: word + " is available for " + dialect,
  };
}
