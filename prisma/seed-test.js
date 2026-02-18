import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

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
