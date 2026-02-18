import type { Handle } from "@sveltejs/kit";
import DELETE_ACCESS_TOKEN_COOKIE from "$lib/utils/delete-access-token-cookie";
import AccessToken from "$lib/api/tokens/access-token";
import jwt from "jsonwebtoken";
import { PASSWORD_SECRET } from "$lib/api/secrets";

function applyUserLocals(event: Parameters<Handle>[0]["event"], token: string) {
  const payload = jwt.verify(token, PASSWORD_SECRET) as jwt.JwtPayload;
  event.locals.user = {
    id: payload.id,
    email: payload.email,
    username: payload.username,
    preferredDialect: payload.preferredDialect,
  };
}

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("access-token");

  if (token && event.url.pathname !== "/api/auth/logout") {
    try {
      applyUserLocals(event, token);
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError && e instanceof jwt.TokenExpiredError) {
        const newAccessToken = await AccessToken.update(token);
        let accessTokenCookie: string;

        if (newAccessToken) {
          applyUserLocals(event, newAccessToken);
          accessTokenCookie = AccessToken.createCookie(newAccessToken);
        } else {
          delete event.locals.user;
          accessTokenCookie = DELETE_ACCESS_TOKEN_COOKIE;
        }

        const response = await resolve(event);
        response.headers.append("set-cookie", accessTokenCookie);
        return response;
      }
    }
  }

  return resolve(event);
};
