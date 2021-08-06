import type { Locals, Session } from "$lib/models/session";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export async function getSession(request: {
  locals: Locals;
}): Promise<Session> {
  const user = request.locals.user;
  if (user) return { user };
  return {};
}

export async function handle({
  request,
  resolve,
}: {
  request: { locals: Locals; headers: any };
  resolve: Function;
}) {
  const token = cookie.parse(request.headers.cookie || "").jwt;
  const secret = import.meta.env.VITE_JWT_SECRET as string;

  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload !== "string") {
      request.locals.user = {
        id: payload.id,
        email: payload.email,
        username: payload.username,
        iat: payload.iat,
      };
    }
  } catch (JsonWebTokenError) {}

  try {
    return await resolve(request);
  } catch (e) {
    if ("status" in e) return e;
    throw e;
  }
}
