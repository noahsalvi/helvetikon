import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";
import { promises as fs } from "fs";
import { v4 } from "uuid";
import ffmpeg from "ffmpeg";
import path from "path";

const __dirname = path.resolve();
const production = process.env.NODE_ENV === "production";
const configuredAudioSamplesRoot = process.env.AUDIO_SAMPLES_FS_ROOT;

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

  const rootPath = configuredAudioSamplesRoot
    ? path.resolve(configuredAudioSamplesRoot)
    : path.join(
        __dirname,
        production ? "static-helvetikon/audio-samples" : "static/audio-samples"
      );

  const folderPath = `${word.dialect}/${word.swissGerman}/${user.username}/`;
  // Create folder if missing
  await fs.mkdir(path.join(rootPath, folderPath), { recursive: true });
  // Temporary Blob file
  const blobPath = folderPath + uuid + ".blob";
  await fs.writeFile(path.join(rootPath, blobPath), buffer);
  const video = await new ffmpeg(path.join(rootPath, blobPath));
  const filePath = folderPath + uuid + ".mp3";
  await video.fnExtractSoundToMP3(path.join(rootPath, filePath));
  await fs.unlink(path.join(rootPath, blobPath));

  await prisma.audioSample.create({
    data: { id: uuid, userId: user.id, wordId: wordId, path: filePath },
  });

  return { status: 201, body: "Audio Sample created" };
}
