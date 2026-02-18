import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import AccessToken from "$lib/api/tokens/access-token";
import { PASSWORD_RESET_SECRET } from "$lib/api/secrets";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, url, locals }) => {
  const body = await request.json();
  const password: string = body.password;
  const token: string | null = url.searchParams.get("token");

  let payload: jwt.JwtPayload & User;
  try {
    payload = jwt.verify(token, PASSWORD_RESET_SECRET) as any;
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return new Response("Token expired", {
        status: 401,
        headers: { reason: "expired" },
      });
    } else if (e instanceof jwt.JsonWebTokenError) {
      return new Response("Token not valid", { status: 401 });
    }
    throw e;
  }

  const saltedAndHashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: payload.id },
    data: {
      password: { set: saltedAndHashedPassword },
      sessions: { deleteMany: {} },
      lastPasswordResetAt: new Date(),
    },
  });

  const accessToken = await AccessToken.create(payload);
  const accessTokenCookie = AccessToken.createCookie(accessToken);

  const response = new Response("Password was reseted", { status: 200 });
  response.headers.append("set-cookie", accessTokenCookie);

  locals.user = {
    id: payload.id,
    email: payload.email,
    username: payload.username,
    preferredDialect: payload.preferredDialect,
  };

  return response;
};
