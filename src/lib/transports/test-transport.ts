import type { TestAccount } from "nodemailer";

export function getTestTansportOptions(account: TestAccount) {
  return {
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  };
}
