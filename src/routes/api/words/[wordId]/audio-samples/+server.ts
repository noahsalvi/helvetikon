import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";
import { promises as fs } from "fs";
import { v4 } from "uuid";
import ffmpeg from "ffmpeg";
import path from "path";
import type { RequestHandler } from "./$types";

const __dirname = path.resolve();
const production = process.env.NODE_ENV === "production";
const configuredAudioSamplesRoot = process.env.AUDIO_SAMPLES_FS_ROOT;

export const POST: RequestHandler = async ({ request, params, locals }) => {
  let user: ReturnType<typeof authorize>;
  try {
    user = authorize(locals);
  } catch (e: any) {
    if (e && typeof e === "object" && "status" in e) {
      return new Response(e.body, { status: e.status });
    }
    throw e;
  }

  const blob = new Uint8Array(await request.arrayBuffer());

  const wordId = parseInt(params.wordId);
  const word: any = await prisma.word.findUnique({
    where: { id: wordId },
    include: { audioSamples: true },
  });

  if (!word) return new Response("Word not found", { status: 400 });
  if (word.audioSamples.length) {
    return new Response("This word already has a audio sample.", { status: 409 });
  }

  const uuid = v4();
  const buffer = Buffer.from(blob);

  const rootPath = configuredAudioSamplesRoot
    ? path.resolve(configuredAudioSamplesRoot)
    : path.join(
        __dirname,
        production ? "static-helvetikon/audio-samples" : "static/audio-samples"
      );

  const folderPath = `${word.dialect}/${word.swissGerman}/${user.username}/`;
  await fs.mkdir(path.join(rootPath, folderPath), { recursive: true });

  const blobPath = folderPath + uuid + ".blob";
  await fs.writeFile(path.join(rootPath, blobPath), new Uint8Array(buffer));
  const video = await new ffmpeg(path.join(rootPath, blobPath));
  const filePath = folderPath + uuid + ".mp3";
  await video.fnExtractSoundToMP3(path.join(rootPath, filePath));
  await fs.unlink(path.join(rootPath, blobPath));

  await prisma.audioSample.create({
    data: { id: uuid, userId: user.id, wordId, path: filePath },
  });

  return new Response("Audio Sample created", { status: 201 });
};
