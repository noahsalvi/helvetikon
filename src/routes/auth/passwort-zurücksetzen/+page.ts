import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { jwtDecode } from "jwt-decode";

export const load: PageLoad = ({ url }) => {
  const token = url.searchParams.get("token");
  if (!token) {
    throw redirect(302, "/");
  }

  const user = jwtDecode<{ email: string; username: string }>(token);
  return { user };
};
