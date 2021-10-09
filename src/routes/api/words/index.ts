import prisma, { PrismaClientKnownRequestError } from "$lib/prisma";
import authorize from "$lib/api/middlewares/authorize";
import type { Dialect } from "@prisma/client";

export async function get({}) {
  const words = await prisma.word.findMany();
  return {
    body: words,
  };
}

type WordDraft = {
  swissGerman: string;
  german?: string;
  spellings: string[];
  dialect: Dialect;
};

export async function post({ body, locals }) {
  const user = authorize(locals);
  const wordDraft: WordDraft = body;
  const wordDraftSanitized: WordDraft = {
    swissGerman: wordDraft.swissGerman?.trim() || null,
    german: wordDraft.german?.trim() || null,
    spellings: wordDraft.spellings.map((spelling) => spelling?.trim() || null),
    dialect: wordDraft.dialect,
  };

  try {
    const word = await prisma.word.create({
      data: { ...wordDraftSanitized, createdBy: { connect: { id: user.id } } },
    });

    return {
      body: word,
    };
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError)
      return {
        status: 409,
        body: "Word already exists\n" + e,
      };

    throw e;
  }
}
