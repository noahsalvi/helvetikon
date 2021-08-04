import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function get({ params }) {
  const query = params.word;

  const word = await prisma.word.findUnique({
    where: { swissGerman: query },
  });

  if (!word) {
    return { status: "404", body: "Could not find word " + query };
  }

  return {
    body: word,
  };
}
