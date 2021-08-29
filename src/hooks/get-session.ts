import type { Locals, Session } from "$lib/models/session";

export async function getSession(request: {
  locals: Locals;
}): Promise<Session> {
  const user = request.locals.user;
  if (user) return { user };
  return {};
}
