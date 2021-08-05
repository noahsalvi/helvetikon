import cookie from "cookie";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function _authorize(
  headers: { cookie: string },
  callback: (payload: any) => any
) {
  const token = cookie.parse(headers.cookie || "").jwt;

  if (!token) {
    return {
      status: 401,
      body: "No JWT-Cookie found",
    };
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return callback(payload);
  } catch (JsonWebTokenError) {
    return {
      status: 401,
      body: "Authorization failed",
    };
  }
}
