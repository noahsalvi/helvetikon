import { PrismaClient } from "@prisma/client";
import faker from "faker";
export async function get() {
  const prisma = new PrismaClient();
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
