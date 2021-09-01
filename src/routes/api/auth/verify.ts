import prisma from "$lib/prisma";
import type { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import AccessToken from "$lib/api/tokens/access-token";

export async function get({ query }) {
  const token = query.get("token");
  const secret = import.meta.env.VITE_EMAIL_VERIFICATION_SECRET as string;
  try {
    const payload = jwt.verify(token, secret);

    const user = payload as User;
    const userDB = await prisma.user.findUnique({ where: { id: user.id } });
    if (userDB.verified) {
      return {
        status: 409,
        body: "User is already verified",
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true },
    });

    const jwtCookie = AccessToken.createCookie(await AccessToken.create(user));

    return {
      status: 201,
      headers: {
        "set-cookie": [jwtCookie],
      },
    };
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return {
        status: 400,
        body: "jwt is wrong, " + e,
      };
    } else {
      throw e;
    }
  }
}
