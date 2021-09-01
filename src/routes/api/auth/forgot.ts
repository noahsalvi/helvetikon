import { renderMail } from "$lib/email-renderer";
import prisma from "$lib/prisma";
import { sendMailNoreply } from "$lib/transports/noreply-transports";
import PasswordResetToken from "$lib/api/tokens/password-reset-token";
import ForgotPasswordEmail from "$lib/emails/ForgotPasswordEmail.svelte";

const requestExpiration = 10 * 60 * 1000;
const successResponse = { body: "Password reset mail sent" };

export async function post({ body }) {
  const email = body.email;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return successResponse;

  const now = new Date();
  const requestingAgainTooSoon =
    user.lastForgotPasswordAt &&
    now.getTime() - user.lastForgotPasswordAt?.getTime() < requestExpiration;
  if (requestingAgainTooSoon) return successResponse;

  const token = PasswordResetToken.create(user);

  sendMailNoreply({
    to: `${user.username} <${user.email}>`,
    subject: "Passwort vergessen 😬",
    html: await renderMail(ForgotPasswordEmail, { data: { user, token } }),
  }).then(async (response) => {
    if (response.response.startsWith("250")) {
      // Await is needed for the prisma query to be made
      await prisma.user.update({
        where: { id: user.id },
        data: { lastForgotPasswordAt: now },
      });
    }
  });

  return successResponse;
}
