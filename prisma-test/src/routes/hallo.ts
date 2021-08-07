import Prisma from "@prisma/client";
const { PrismaClient } = Prisma;
// import { PrismaClient } from "../../node_modules/.prisma/client";
import { Word } from "@prisma/client";
// import client from "../lib/prisma";

// import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function get() {
  const word: Word = {} as any;
  console.log(word);
  const users = await prisma.user.findMany({});
  return {
    body: "This works" + users,
  };
}
