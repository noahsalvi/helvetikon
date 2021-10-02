import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import AccessToken from "$lib/api/tokens/access-token";
import cookie from "cookie";
import { COOKIE_MAX_AGE } from "$lib/utils/cookie-max-age";

export async function post({ body, locals }) {
  const email: string = body.email;
  const password: string = body.password;

  const authenticationFailed = {
    status: 401,
    body: "Authentication failed",
  };

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) return authenticationFailed;

  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) return authenticationFailed;

  if (!user.verified)
    return {
      status: 401,
      body: "Account ist not verified",
      headers: { reason: "verified" },
    };

  const jwtCookie = AccessToken.createCookie(await AccessToken.create(user));
  const hasLoggedInBefore = cookie.serialize("not-new", "true", {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return {
    headers: {
      "set-cookie": [jwtCookie, hasLoggedInBefore],
    },
    body: "Logged In, JWT-Cookie set",
  };
}
