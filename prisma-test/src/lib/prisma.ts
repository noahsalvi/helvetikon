import * as prisma from "@prisma/client";
import type { PrismaClient as pc } from "@prisma/client";

const PrismaClient = prisma.PrismaClient
  ? prisma.PrismaClient
  : (prisma as any).default.PrismaClient;

console.log(prisma);

const client: pc = new PrismaClient();

export default client;
