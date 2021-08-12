import prisma from "$lib/prisma";
import type { Word } from "@prisma/client";

export async function get({ params }) {
  const { word } = params;

  const wordsSwissGermanMatch: Word[] =
    await prisma.$queryRaw`select * from "Word" where "swissGerman" = ${word} collate "de_CH"`;

  const wordsSpellingMatch: Word[] =
    await prisma.$queryRaw`select * from "Word" where ${word} = any(spellings)`;

  const words = [...wordsSwissGermanMatch, ...wordsSpellingMatch];

  if (words.length) return { status: 409, body: words[0] };

  return {
    body: word + " is available",
  };
}
