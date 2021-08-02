import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function get() {
  const words = await prisma.word.findMany({ include: { meanings: true } });
  console.dir(words);
  return {
    body: words,
  };
}
