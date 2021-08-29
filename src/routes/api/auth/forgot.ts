import prisma from "$lib/prisma";
import noreplyTransporter, {
  NOREPLY_FROM,
} from "$lib/transporters/noreply-transporter";
import PasswordResetToken from "../_utils/password-reset-token";

const successResponse = { body: "Password reset mail sent" };

export async function post({ body }) {
  const email = body.email;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return successResponse;

  const token = PasswordResetToken.create(user);

  noreplyTransporter.sendMail({
    from: NOREPLY_FROM,
    to: `${user.username} <${user.email}>`,
    subject: "Passwort vergessen 😬",
    html: `<a href="https://helvetikon.org/passwort-vergessen?token=${token}">Passwort vergessen</a>`,
  });

  return successResponse;
}
