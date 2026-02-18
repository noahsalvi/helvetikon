import prisma from "$lib/prisma";
import type { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import AccessToken from "$lib/api/tokens/access-token";
import { EMAIL_VERIFICATION_SECRET } from "$lib/api/secrets";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, locals }) => {
  const token = url.searchParams.get("token");
  try {
    const payload = jwt.verify(token, EMAIL_VERIFICATION_SECRET);

    const user = payload as User;
    const userDB = await prisma.user.findUnique({ where: { id: user.id } });
    if (!userDB) {
      return new Response("User not found", { status: 404 });
    }

    if (userDB.verified) {
      return new Response("User is already verified", { status: 409 });
    }

    await prisma.user.update({
      where: { id: userDB.id },
      data: { verified: true },
    });

    const jwtCookie = AccessToken.createCookie(await AccessToken.create(userDB));

    const response = new Response(null, { status: 201 });
    response.headers.append("set-cookie", jwtCookie);

    locals.user = {
      id: userDB.id,
      email: userDB.email,
      username: userDB.username,
      preferredDialect: userDB.preferredDialect,
    };

    return response;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return new Response("jwt is wrong, " + e, { status: 400 });
    }

    throw e;
  }
};
