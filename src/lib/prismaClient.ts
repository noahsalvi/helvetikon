import Prisma from "@prisma/client";

const { PrismaClient } = Prisma;
const client = new PrismaClient();

export default client;
