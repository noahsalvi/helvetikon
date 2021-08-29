import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import AccessToken from "../_utils/access-token";

export async function post({ body, query, headers }) {
  const password: string = body.password;
  const token: string = query.get("token");

  let payload: jwt.JwtPayload & User;
  try {
    const secret = import.meta.env.VITE_PASSWORD_RESET_SECRET as string;
    payload = jwt.verify(token, secret) as any;
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return {
        status: 401,
        body: "Token expired",
        headers: { reason: "expired" },
      };
    } else if (e instanceof jwt.JsonWebTokenError) {
      return {
        status: 401,
        body: "Token not valid",
      };
    }
    throw e;
  }

  const saltedAndHashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: payload.id },
    data: {
      password: { set: saltedAndHashedPassword },
      sessions: { deleteMany: {} },
    },
  });

  const accessTokenCookie = AccessToken.createCookie(
    await AccessToken.create(payload)
  );

  return {
    status: 200,
    body: "Password was reseted",
    headers: {
      "set-cookie": [accessTokenCookie],
    },
  };
}
