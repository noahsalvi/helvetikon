import type { Dialect } from "@prisma/client";

declare global {
  namespace App {
    interface Locals {
      user?: {
        id: number;
        email: string;
        username: string;
        preferredDialect: Dialect;
      };
    }

  }
}

export {};
