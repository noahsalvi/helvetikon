import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const cacheTTL = 3 * 60 * 1000;

let recentWordsCache = [];
let recentWordsTimestamp = 0;

export const GET: RequestHandler = async () => {
  const needsRenewal = recentWordsTimestamp < Date.now() - cacheTTL;

  if (needsRenewal) {
    const words = await prisma.word.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        interpretations: {
          include: {
            upvotes: { select: { id: true } },
            downvotes: { select: { id: true } },
          },
        },
      },
    });
    recentWordsCache = words;
    recentWordsTimestamp = Date.now();
  }

  return json(recentWordsCache);
};
