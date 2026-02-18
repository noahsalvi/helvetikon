import DELETE_ACCESS_TOKEN_COOKIE from "$lib/utils/delete-access-token-cookie";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = ({ locals }) => {
  delete locals.user;

  const response = json({ ok: true });
  response.headers.append("set-cookie", DELETE_ACCESS_TOKEN_COOKIE);
  return response;
};
