import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";
import type { WordGender, WordType } from "@prisma/client";

export async function put({ params, body, locals }) {
  authorize(locals);
  console.log(params, body);
  const wordType: WordType = body.wordType;
  const nounGender: WordGender = body.gender;
  console.log(nounGender);
  const wordId = parseInt(params.wordId);
  const isNoun = wordType === "NOUN";
  console.log(isNoun);
  console.log(wordId);
  const word = await prisma.word.findUnique({ where: { id: wordId } });
  if (word.wordType) return { status: 409, body: "Word Type already defined" };

  await prisma.word.update({
    where: { id: wordId },
    include: { grammar: true },
    data: isNoun
      ? { wordType, grammar: { update: { nounGender } } }
      : { wordType },
  });

  return {
    body: null,
  };
}
