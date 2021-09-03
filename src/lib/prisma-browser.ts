import Prisma, * as PrismaScope from "@prisma/client";

export const Dialect = Prisma?.Dialect || PrismaScope?.Dialect;
