import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";
import { promises as fs } from "fs";
import { v4 } from "uuid";
import ffmpeg from "ffmpeg";
import path from "path";

const __dirname = path.resolve();
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

  const rootPath =
    __dirname +
    (production
      ? "/static-helvetikon/audio-samples/"
      : "/static/audio-samples/");

  const folderPath = `${word.dialect}/${word.swissGerman}/${user.username}/`;
  // Create folder if missing
  await fs.mkdir(rootPath + folderPath, { recursive: true });
  // Temporary Blob file
  const blobPath = folderPath + uuid + ".blob";
  await fs.writeFile(rootPath + blobPath, buffer);
  const video = await new ffmpeg(rootPath + blobPath);
  const filePath = folderPath + uuid + ".mp3";
  await video.fnExtractSoundToMP3(rootPath + filePath);
  await fs.unlink(rootPath + blobPath);

  await prisma.audioSample.create({
    data: { id: uuid, userId: user.id, wordId: wordId, path: filePath },
  });

  return { status: 201, body: "Audio Sample created" };
}
