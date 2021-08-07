// import Prisma from "../../node_modules/.prisma/client/index";
// const { PrismaClient } = Prisma;
// import { PrismaClient } from "../../node_modules/.prisma/client";
import client from "../lib/prisma";

// import { PrismaClient } from "@prisma/client";
const prisma = client;
export function get() {
  return {
    body: "This works" + prisma,
  };
}
