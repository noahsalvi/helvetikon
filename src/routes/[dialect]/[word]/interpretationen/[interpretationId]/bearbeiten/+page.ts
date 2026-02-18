import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
  const interpretationId = params.interpretationId;
  const res = await fetch("/api/interpretations/" + interpretationId);
  if (!res.ok) {
    throw error(res.status, await res.text());
  }

  const interpretation = await res.json();
  return { interpretation };
};
