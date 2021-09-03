import type { Locals } from "$lib/models/session";
import DELETE_ACCESS_TOKEN_COOKIE from "$lib/utils/delete-access-token-cookie";
import AccessToken from "$lib/api/tokens/access-token";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { PASSWORD_SECRET } from "$lib/api/secrets";

export async function handle({
  request,
  resolve,
}: {
  request: { locals: Locals; headers: any; path: string };
  resolve: Function;
}) {
  const token = cookie.parse(request.headers.cookie || "")["access-token"];

  // Replace token with newer token if one was set in a parallel call
  if (token && request.path !== "/api/auth/logout") {
    try {
      const payload = jwt.verify(token, PASSWORD_SECRET) as jwt.JwtPayload;
      request.locals.user = {
        id: payload.id,
        email: payload.email,
        username: payload.username,
        preferredDialect: payload.preferredDialect,
      };
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        if (e instanceof jwt.TokenExpiredError) {
          const newAccessToken = await AccessToken.update(token);
          let accessTokenCookie: string;

          if (newAccessToken) {
            const payload = jwt.verify(
              newAccessToken,
              PASSWORD_SECRET
            ) as jwt.JwtPayload;
            request.locals.user = {
              id: payload.id,
              email: payload.email,
              username: payload.username,
              preferredDialect: payload.preferredDialect,
            };
            accessTokenCookie = AccessToken.createCookie(newAccessToken);
          } else {
            delete request.locals.user;
            accessTokenCookie = DELETE_ACCESS_TOKEN_COOKIE;
          }

          const response = await resolveEnhanced(resolve, request);

          const cookies: string[] = response.headers["set-cookie"] || [];
          cookies.push(accessTokenCookie);

          return {
            ...response,
            headers: {
              ...response.headers,
              "set-cookie": cookies,
            },
          };
        }
      } else throw e;
    }
  }

  return resolveEnhanced(resolve, request);
}

/** To catch responses returned by throwing */
async function resolveEnhanced(resolve: Function, request: any) {
  try {
    return await resolve(request);
  } catch (e) {
    if ("status" in e) return e;
    throw e;
  }
}
