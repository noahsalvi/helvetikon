import prisma, { PrismaClientKnownRequestError } from "$lib/prisma";
import authorize from "$lib/api/middlewares/authorize";
import { json } from "@sveltejs/kit";
import type { Dialect } from "@prisma/client";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const words = await prisma.word.findMany();
  return json(words);
};

type WordDraft = {
  swissGerman: string;
  german?: string;
  spellings: string[];
  dialect: Dialect;
};

export const POST: RequestHandler = async ({ request, locals }) => {
  let user: ReturnType<typeof authorize>;
  try {
    user = authorize(locals);
  } catch (e: any) {
    if (e && typeof e === "object" && "status" in e) {
      return new Response(e.body, { status: e.status });
    }
    throw e;
  }

  const wordDraft: WordDraft = await request.json();
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

    return json(word);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return new Response("Word already exists\n" + e, { status: 409 });
    }

    throw e;
  }
};
