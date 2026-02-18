import bcrypt from "bcrypt";
import { promises as fs } from "fs";
import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

async function seed() {
  const password = await bcrypt.hash("TestPass123!", 10);

  const ownerUser = await prisma.user.upsert({
    where: { email: "owner.test@helvetikon.local" },
    update: {
      username: "owner_test",
      verified: true,
      preferredDialect: "BERN",
      password,
    },
    create: {
      email: "owner.test@helvetikon.local",
      username: "owner_test",
      verified: true,
      preferredDialect: "BERN",
      password,
    },
  });

  await prisma.user.upsert({
    where: { email: "unverified.test@helvetikon.local" },
    update: {
      username: "unverified_test",
      verified: false,
      preferredDialect: "ZUERICH",
      password,
    },
    create: {
      email: "unverified.test@helvetikon.local",
      username: "unverified_test",
      verified: false,
      preferredDialect: "ZUERICH",
      password,
    },
  });

  const seedWord = await prisma.word.upsert({
    where: {
      swissGerman_dialect: {
        swissGerman: "Gruezi",
        dialect: "BERN",
      },
    },
    update: {
      german: "Hallo",
      spellings: ["Gruezi", "Grüezi"],
      createdByUserId: ownerUser.id,
    },
    create: {
      swissGerman: "Gruezi",
      german: "Hallo",
      spellings: ["Gruezi", "Grüezi"],
      dialect: "BERN",
      createdByUserId: ownerUser.id,
    },
  });

  await prisma.word.upsert({
    where: {
      swissGerman_dialect: {
        swissGerman: "Schoggi",
        dialect: "ZUERICH",
      },
    },
    update: {
      german: "Schokolade",
      spellings: ["Schoggi"],
      createdByUserId: ownerUser.id,
    },
    create: {
      swissGerman: "Schoggi",
      german: "Schokolade",
      spellings: ["Schoggi"],
      dialect: "ZUERICH",
      createdByUserId: ownerUser.id,
    },
  });

  const existingInterpretation = await prisma.interpretation.findFirst({
    where: {
      wordId: seedWord.id,
      createdByUserId: ownerUser.id,
    },
  });

  if (!existingInterpretation) {
    await prisma.interpretation.create({
      data: {
        wordId: seedWord.id,
        createdByUserId: ownerUser.id,
        meanings: {
          create: [
            {
              explanation: "Typische Begruessig",
              examples: ["Gruezi mitenand"],
            },
          ],
        },
      },
    });
  }

  const audioPath = "BERN/Gruezi/owner_test/seed-gruezi.mp3";
  const audioSamplesRoot =
    process.env.AUDIO_SAMPLES_FS_ROOT ||
    path.join(process.cwd(), "static", "audio-samples-test");
  const absoluteAudioPath = path.join(
    audioSamplesRoot,
    audioPath
  );
  await fs.mkdir(path.dirname(absoluteAudioPath), { recursive: true });
  // CI fixture: keep deterministic audio-sample path without requiring FFmpeg.
  await fs.writeFile(absoluteAudioPath, Buffer.alloc(0));

  await prisma.audioSample.upsert({
    where: { id: "seed-audio-gruezi" },
    update: {
      userId: ownerUser.id,
      wordId: seedWord.id,
      path: audioPath,
    },
    create: {
      id: "seed-audio-gruezi",
      userId: ownerUser.id,
      wordId: seedWord.id,
      path: audioPath,
    },
  });

  console.log("Test DB seeded with deterministic fixtures");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
