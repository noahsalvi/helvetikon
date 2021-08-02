import { PrismaClient } from "@prisma/client";
import faker from "faker";
const prisma = new PrismaClient();
faker.locale = "de_CH";
export async function get() {
  await prisma.meaning.deleteMany();
  await prisma.example.deleteMany();
  await prisma.spelling.deleteMany();
  await prisma.word.deleteMany();
  for (let i = 0; i < 100; i++) {
    const result = await prisma.word.create({
      data: {
        german: faker.random.word(),
        swissGerman: faker.random.word(),
        meanings: {
          createMany: {
            data: [
              { value: faker.random.words() },
              { value: faker.random.words() },
            ],
          },
        },
        examples: {
          createMany: {
            data: [
              { value: faker.random.words() },
              { value: faker.random.words() },
            ],
          },
        },
        spellings: {
          createMany: {
            data: [
              { value: faker.random.words() },
              { value: faker.random.words() },
            ],
          },
        },
      },
    });
    console.log(result);
  }

  return {
    body: "success",
  };
}
