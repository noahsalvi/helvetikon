import userAnonym from "$lib/userAnonym";
import { PrismaClient } from "@prisma/client";
import faker from "faker";
const prisma = new PrismaClient();
faker.locale = "de_CH";
export async function get() {
  await prisma.word.deleteMany();
  for (let i = 0; i < 100; i++) {
    const result = await prisma.word.create({
      data: {
        createdBy: userAnonym,
        german: faker.random.word(),
        swissGerman: faker.random.word(),
        spellings: [faker.random.words(), faker.random.words()],
      },
    });
    console.log(result);
  }

  return {
    body: "success",
  };
}
