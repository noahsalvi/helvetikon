import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function get({ params, headers }) {
  const query = params.word;

  const word = await prisma.word.findUnique({
    include: {
      createdBy: true,
      interpretations: { include: { createdBy: true } },
    },
    where: { swissGerman: query },
  });

  if (!word) {
    return { status: "404", body: "Could not find word " + query };
  }

  return {
    body: word,
  };
}
