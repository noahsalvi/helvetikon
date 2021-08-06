import type { Session } from "$lib/models/session";

export default function authorize(locals: Session) {
  if (!locals.user) {
    throw {
      status: 401,
      body: "Authorization failed",
    };
  }

  return locals.user;
}
