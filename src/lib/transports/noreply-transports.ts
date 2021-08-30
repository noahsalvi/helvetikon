import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { getTestTansportOptions } from "./test-transport";

const production = process.env.NODE_ENV === "production";
const productionTransportOptions: SMTPTransport.Options = {
  host: "mail.helvetikon.org",
  port: 587,
  auth: {
    user: "noreply@helvetikon.org",
    pass: import.meta.env.VITE_EMAIL_NOREPLY_PASSWORD as string,
  },
};
const from = "Helvetikon 🇨🇭 <noreply@helvetikon.org>";

export async function sendMailNoreply(mailOptions: Mail.Options) {
  mailOptions.from ||= from;

  let transportOptions: SMTPTransport.Options;
  if (production) {
    transportOptions = productionTransportOptions;
  } else {
    const account = await nodemailer.createTestAccount();
    transportOptions = getTestTansportOptions(account);
  }
  const transport = nodemailer.createTransport(transportOptions);

  return transport.sendMail(mailOptions).then((info) => {
    if (!production) {
      const emailLink = nodemailer.getTestMessageUrl(info);
      console.log(
        "\x1b[1m%s\x1b[44m\x1b[5m%s\x1b[0m",
        `📧 Email '${mailOptions.subject}' sent\n`,
        `${emailLink}`
      );
    }

    return info;
  });
}