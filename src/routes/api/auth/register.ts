import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import validator from "validator";
import _validate from "../_middlewares/validate";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import noreplyTransporter, {
  NOREPLY_FROM,
} from "$lib/transporters/noreply-transporter";
import { renderMail } from "$lib/email-renderer";
import VerifyEmail from "$lib/emails/VerifyEmail.svelte";

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
  const secret = import.meta.env.VITE_EMAIL_VERIFICATION_SECRET as string;
  const token = jwt.sign(safeUser, secret);

  const html = await renderMail(VerifyEmail, { data: { user, token } });
  noreplyTransporter.sendMail({
    from: NOREPLY_FROM,
    to: `${user.username} <${user.email}>`,
    subject: "E-Mail verifizieren",
    html,
  });
}
