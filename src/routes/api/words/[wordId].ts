import { PrismaClient, Word } from "@prisma/client";
const prisma = new PrismaClient();

export async function put({ params, body }) {
  const id = parseInt(params.wordId);
  const newWord: Word = JSON.parse(body);

  await prisma.wordHistory.create({
    data: {
      swissGerman: newWord.swissGerman,
      german: newWord.german,
      examples: newWord.examples,
      spellings: newWord.spellings,
      meanings: newWord.meanings,

      createdBy: {
        connect: { id: 1 },
      },
      word: { connect: { id } },
    },
  });

  const word = await prisma.word.update({
    where: { id },
    data: {
      german: newWord.german,
      swissGerman: newWord.swissGerman,
      examples: newWord.examples,
      meanings: newWord.meanings,
      spellings: newWord.spellings,
      updatedAt: new Date(),
    },
  });

  return {
    body: word,
  };
}
