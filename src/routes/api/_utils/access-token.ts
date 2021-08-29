import prisma from "$lib/prisma";
import type { User } from "@prisma/client";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const accessTokensBeingUpdated = new Map<string, Promise<string>>();

export async function createAccessToken(user: User) {
  const safeUser = { id: user.id, email: user.email, username: user.username };
  const secret = import.meta.env.VITE_JWT_SECRET as string;
  const token = jwt.sign(safeUser, secret, { expiresIn: "3s" });
  await prisma.session.create({ data: { token, userId: user.id } });

  return token;
}

export async function updateAccessToken(token: string) {
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
  const newAccessToken = await createAccessToken(session.user);
  newTokenPromiseResolver(newAccessToken);
  setTimeout(() => accessTokensBeingUpdated.delete(token), 2000);

  return newAccessToken;
}

export function createAccessTokenCookie(token: string) {
  return cookie.serialize("access-token", token, {
    path: "/",
    httpOnly: true,
  });
}
