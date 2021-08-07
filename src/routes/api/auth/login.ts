import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import createJWTCookie from "../_utils/createJWTCookie";

export async function post({ body, locals }) {
  const username: string = body.username;
  const password: string = body.password;

  const authenticationFailed = {
    status: 401,
    body: "Authentication failed",
  };

  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user) return authenticationFailed;

  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) return authenticationFailed;

  const jwtCookie = createJWTCookie(user);

  return {
    headers: {
      "set-cookie": [jwtCookie],
    },
    body: "Logged In, JWT-Cookie set",
  };
}
