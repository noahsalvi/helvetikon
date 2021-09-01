import { renderMail } from "$lib/email-renderer";
import prisma from "$lib/prisma";
import { sendMailNoreply } from "$lib/transports/noreply-transports";
import PasswordResetToken from "../_utils/password-reset-token";
import ForgotPasswordEmail from "$lib/emails/ForgotPasswordEmail.svelte";

const successResponse = { body: "Password reset mail sent" };

export async function post({ body }) {
  const email = body.email;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return successResponse;

  const token = PasswordResetToken.create(user);

  sendMailNoreply({
    to: `${user.username} <${user.email}>`,
    subject: "Passwort vergessen 😬",
    html: await renderMail(ForgotPasswordEmail, { data: { user, token } }),
  });

  return successResponse;
}
