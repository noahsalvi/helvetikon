import { PrismaClient, Word } from "@prisma/client";
const prisma = new PrismaClient();

export async function get({ params }) {
  const { searchQuery } = params;

  const wordsSwissGermanMatch = await prisma.word.findMany({
    where: {
      swissGerman: { contains: searchQuery, mode: "insensitive" },
    },
  });

  // const wordsSpellingMatch = await prisma.word.findMany({
  //   where: {
  //     spellings: {  mode: "insensitive" },
  //   },
  // });

  const wordsGermanMatch = await prisma.word.findMany({
    where: {
      german: { contains: searchQuery, mode: "insensitive" },
    },
  });

  const words = [
    ...wordsSwissGermanMatch.sort(
      (a, b) => a.swissGerman.length - b.swissGerman.length
    ),
    ...wordsGermanMatch.sort((a, b) => a.german.length - b.german.length),
  ];

  return {
    body: words,
  };
}
