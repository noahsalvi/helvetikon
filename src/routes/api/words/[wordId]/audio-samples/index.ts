import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";
import { promises as fs } from "fs";
import { v4 } from "uuid";

const production = process.env.NODE_ENV === "production";

export async function post({ body, params, locals }) {
  const user = authorize(locals);
  const blob: Uint8Array = body;

  const wordId = parseInt(params.wordId);
  const word = await prisma.word.findUnique({
    where: { id: wordId },
    include: { audioSamples: true },
  });

  if (!word) return { status: 400, body: "Word not found" };
  if (word.audioSamples.length)
    return { status: 409, body: "This word already has a audio sample." };

  const uuid: string = v4();
  const buffer = Buffer.from(blob);

  const rootPath = production
    ? "static-helvetikon/audio-samples/"
    : "static/audio-samples/";
  const path = `${word.dialect}/${word.swissGerman}/${user.username}/`;
  const fileName = `${uuid}.mp3`;

  await fs.mkdir(rootPath + path, { recursive: true });
  await fs.writeFile(rootPath + path + fileName, buffer);
  await prisma.audioSample.create({
    data: { id: uuid, userId: user.id, wordId: wordId, path: path + fileName },
  });

  return { status: 201, body: "Audio Sample created" };
}
