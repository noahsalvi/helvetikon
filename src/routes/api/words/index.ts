import userAnonym from "$lib/userAnonym";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type WordDraft = { swissGerman: string; german: string; spellings: string[] };

export async function post({ body }) {
  const wordDraft: WordDraft = JSON.parse(body);

  const word = await prisma.word.create({
    data: { ...wordDraft, createdBy: userAnonym },
  });

  return {
    body: word,
  };
}
