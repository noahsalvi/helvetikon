import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import validator from "validator";
import createJWTCookie from "../_utils/createJWTCookie";
import _validate from "../_middlewares/validate";

const prisma = new PrismaClient();

export function post({ body }) {
  const username: string = body.username || "";
  const email: string = body.email || "";
  const password: string = body.password || "";

  return _validate(
    [username.length > 3, validator.isEmail(email), password.length > 5],
    async () => {
      const userWithSameUsername = await prisma.user.findFirst({
        where: { username },
      });
      if (userWithSameUsername)
        return { status: 409, body: "Username is already taken" };

      const userWithSameEmail = await prisma.user.findFirst({
        where: { email },
      });
      if (userWithSameEmail)
        return { status: 409, body: "Email is already taken" };

      const passwordHashedAndSalted = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { email, username, password: passwordHashedAndSalted },
      });

      const jwtCookie = createJWTCookie(user);

      return {
        status: 201,
        headers: {
          "set-cookie": [jwtCookie],
        },
        body: "User registered, JWT-Cookie set",
      };
    }
  );
}
