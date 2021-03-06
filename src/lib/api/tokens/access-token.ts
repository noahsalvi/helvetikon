import prisma from "$lib/prisma";
import { COOKIE_MAX_AGE } from "$lib/utils/cookie-max-age";
import type { User } from "@prisma/client";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { PASSWORD_SECRET } from "../secrets";

const accessTokensBeingUpdated = new Map<string, Promise<string>>();

const expiresIn = "10m";

namespace AccessToken {
  export async function create(user: User) {
    const userSafe = {
      id: user.id,
      email: user.email,
      username: user.username,
      preferredDialect: user.preferredDialect,
    };

    const token = jwt.sign(userSafe, PASSWORD_SECRET, { expiresIn });
    await prisma.session.create({ data: { token, userId: user.id } });

    return token;
  }

  export async function update(token: string) {
    const existingNewTokenPromise = accessTokensBeingUpdated.get(token);
    if (existingNewTokenPromise) {
      return await existingNewTokenPromise;
    }

    let newTokenPromiseResolver: (text: string) => void;
    const newTokenPromise = new Promise<string>(
      (res) => (newTokenPromiseResolver = res)
    );
    accessTokensBeingUpdated.set(token, newTokenPromise);

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      newTokenPromiseResolver(null);
      return null;
    }

    await prisma.session.delete({ where: { token } });
    const newAccessToken = await create(session.user);
    newTokenPromiseResolver(newAccessToken);
    setTimeout(() => accessTokensBeingUpdated.delete(token), 2000);

    return newAccessToken;
  }

  export function createCookie(token: string) {
    return cookie.serialize("access-token", token, {
      path: "/",
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE,
    });
  }
}

export default AccessToken;
