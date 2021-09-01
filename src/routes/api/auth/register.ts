import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import validator from "validator";
import _validate from "$lib/api/middlewares/validate";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { renderMail } from "$lib/email-renderer";
import VerifyEmail from "$lib/emails/VerifyEmail.svelte";
import { sendMailNoreply } from "$lib/transports/noreply-transports";
import { EMAIL_VERIFICATION_SECRET } from "$lib/api/secrets";

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

      if (userWithSameUsername) {
        return { status: 409, body: "Username is already taken" };
      }

      const userWithSameEmail = await prisma.user.findFirst({
        where: { email },
      });
      if (userWithSameEmail) {
        return { status: 409, body: "Email is already taken" };
      }

      const passwordHashedAndSalted = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { email, username, password: passwordHashedAndSalted },
      });

      sendVerificationEmail(user);

      return {
        status: 201,
        body: "User registered, verification email sent",
      };
    }
  );
}

async function sendVerificationEmail(user: User) {
  const safeUser = { id: user.id, email: user.email, username: user.username };
  const token = jwt.sign(safeUser, EMAIL_VERIFICATION_SECRET);

  const html = await renderMail(VerifyEmail, { data: { user, token } });
  sendMailNoreply({
    to: `${user.username} <${user.email}>`,
    subject: "E-Mail verifizieren",
    html,
  });
}
