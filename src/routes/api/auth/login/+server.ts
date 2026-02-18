import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import AccessToken from "$lib/api/tokens/access-token";
import cookie from "cookie";
import { COOKIE_MAX_AGE } from "$lib/utils/cookie-max-age";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
  const body = await request.json();
  const email: string = body.email;
  const password: string = body.password;

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    return new Response("Authentication failed", { status: 401 });
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    return new Response("Authentication failed", { status: 401 });
  }

  if (!user.verified) {
    return new Response("Account ist not verified", {
      status: 401,
      headers: { reason: "verified" },
    });
  }

  const jwtCookie = AccessToken.createCookie(await AccessToken.create(user));
  const hasLoggedInBefore = cookie.serialize("not-new", "true", {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  const response = new Response("Logged In, JWT-Cookie set", { status: 200 });
  response.headers.append("set-cookie", jwtCookie);
  response.headers.append("set-cookie", hasLoggedInBefore);

  locals.user = {
    id: user.id,
    email: user.email,
    username: user.username,
    preferredDialect: user.preferredDialect,
  };

  return response;
};
