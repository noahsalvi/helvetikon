import prisma from "$lib/prisma";

export async function get() {
  const words = await prisma.word.findMany();
  return {
    body: words,
  };
}
