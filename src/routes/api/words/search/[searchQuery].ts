import prisma from "$lib/prisma";
import type { Word } from "@prisma/client";

export async function get({ params }) {
  const { searchQuery } = params;

  const wordsSwissGermanMatch: Word[] =
    await prisma.$queryRaw`select * from "Word" where "swissGerman" ~* ${searchQuery} order by char_length("swissGerman")`;

  const wordsGermanMatch: Word[] =
    await prisma.$queryRaw`select * from "Word" where "german"~*${searchQuery} order by char_length("german")`;

  const searchQuerySpellings = `.*${searchQuery}.*`;
  const wordsSpellingMatch: Word[] =
    await prisma.$queryRaw`select * from "Word" where array_to_string(spellings, ',') ~* ${searchQuerySpellings} "de_CH"`;

  const words = removeDuplicates([
    ...wordsSwissGermanMatch,
    ...wordsGermanMatch,
    ...wordsSpellingMatch,
  ]);

  return {
    body: words,
  };
}

function removeDuplicates(arr: { id: number }[]) {
  const newArray = [];
  const foundIds: number[] = [];
  for (const item of arr) {
    if (!foundIds.includes(item.id)) {
      foundIds.push(item.id);
      newArray.push(item);
    }
  }

  return newArray;
}
