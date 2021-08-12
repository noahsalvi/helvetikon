import prisma from "$lib/prisma";

const cacheTTL = 3 * 60 * 1000;

let recentWordsCache = [];
let recentWordsTimestamp: number = 0;

export async function get() {
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

  return {
    body: recentWordsCache,
  };
}
