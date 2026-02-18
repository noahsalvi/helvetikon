import { renderMail } from "$lib/email-renderer";
import prisma from "$lib/prisma";
import { sendMailNoreply } from "$lib/transports/noreply-transports";
import PasswordResetToken from "$lib/api/tokens/password-reset-token";
import ForgotPasswordEmail from "$lib/emails/ForgotPasswordEmail.svelte";
import type { RequestHandler } from "./$types";

const requestExpiration = 10 * 60 * 1000;
const successText = "Password reset mail sent";

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const email = body.email;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return new Response(successText, { status: 200 });

  const now = new Date();
  const requestingAgainTooSoon =
    user.lastForgotPasswordAt &&
    now.getTime() - user.lastForgotPasswordAt?.getTime() < requestExpiration;
  if (requestingAgainTooSoon) return new Response(successText, { status: 200 });

  const token = PasswordResetToken.create(user);

  sendMailNoreply({
    to: `${user.username} <${user.email}>`,
    subject: "Passwort vergessen 😬",
    html: await renderMail(ForgotPasswordEmail, { data: { user, token } }),
  }).then(async (response) => {
    if (response.response.startsWith("250")) {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastForgotPasswordAt: now },
      });
    }
  });

  return new Response(successText, { status: 200 });
};
