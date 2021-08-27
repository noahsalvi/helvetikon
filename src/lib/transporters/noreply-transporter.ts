import nodemailer from "nodemailer";

export default nodemailer.createTransport({
  host: "mail.helvetikon.org",
  port: 587,
  from: "Test <hello@test.ch>",
  auth: {
    user: "noreply@helvetikon.org",
    pass: import.meta.env.VITE_EMAIL_NOREPLY_PASSWORD as string,
  },
});
