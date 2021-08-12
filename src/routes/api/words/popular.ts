import prisma from "$lib/prisma";

const cacheTTL = 30 * 60 * 1000;

let popularWordsCache = [];
let popularWordsTimestamp: number = 0;

export async function get() {
  const needsRenewal = popularWordsTimestamp < Date.now() - cacheTTL;

  if (needsRenewal) {
    const wordsWithUpvotes =
      await prisma.$queryRaw`select w.*, count(u) as popularity from "Word" as w inner join "WordInterpretation" as wi on w.id = wi."wordId" inner join "_WordInterpretationUpvotes" as u on wi.id = u."B" group by w.id order by count(u) desc limit 10`;

    popularWordsCache = wordsWithUpvotes;
    popularWordsTimestamp = Date.now();
  }

  return {
    body: popularWordsCache,
  };
}
