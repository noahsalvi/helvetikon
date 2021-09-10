import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";
import fs from "fs";
import { v4 } from "uuid";

export async function put({ body, params, locals }) {
  const user = await authorize(locals);
  const blob: Blob = body;
  const wordId = parseInt(params.wordId);
  const word = await prisma.word.findUnique({ where: { id: wordId } });

  if (!word) return { status: 400, body: "Word not found" };
  if (word.audioSamplePath)
    return { status: 409, body: "This word already has a audio sample." };

  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const path = `${word.dialect}/${word.swissGerman}/${user.username}/${v4()}`;
  fs.writeFile(path, buffer, (result) => {
    console.log(result);
  });
}
