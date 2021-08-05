import type { User } from "@prisma/client";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export default function createJWTCookie(user: User) {
  const safeUser = { id: user.id, email: user.email, username: user.username };
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign(safeUser, secret);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const jwtCookie = cookie.serialize("jwt", token, {
    path: "/",
    httpOnly: true,
    expires: tomorrow,
  });

  return jwtCookie;
}
