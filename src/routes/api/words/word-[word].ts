import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function get({ params }) {
  const query = params.word;

  const word = await prisma.word.findFirst({
    where: { swissGerman: { equals: query, mode: "insensitive" } },
  });

  return {
    body: word,
  };
}
