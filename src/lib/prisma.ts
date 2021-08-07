import * as Prisma from "@prisma/client";

const PrismaClient = Prisma.PrismaClient
  ? Prisma.PrismaClient
  : (Prisma as any).default.PrismaClient;

const prisma: Prisma.PrismaClient = new PrismaClient();

export default prisma;
