import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const cacheTTL = 30 * 60 * 1000;

let popularWordsCache = [];
let popularWordsTimestamp = 0;

export const GET: RequestHandler = async () => {
  const needsRenewal = popularWordsTimestamp < Date.now() - cacheTTL;

  if (needsRenewal) {
    const wordsWithUpvotes =
      await prisma.$queryRaw`select w.*, count(u) as popularity from "Word" as w inner join "Interpretation" as wi on w.id = wi."wordId" inner join "_InterpretationUpvotes" as u on wi.id = u."B" group by w.id order by count(u) desc limit 10`;
    popularWordsCache = wordsWithUpvotes as any[];
    popularWordsTimestamp = Date.now();
  }

  return json(popularWordsCache);
};
