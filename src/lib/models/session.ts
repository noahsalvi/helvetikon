import type { Dialect } from "@prisma/client";

export type Session = {
  user?: {
    id: number;
    email: string;
    username: string;
    preferredDialect: Dialect;
  };
};

export type Locals = {
  user?: {
    id: number;
    email: string;
    username: string;
    preferredDialect: Dialect;
  };
};
