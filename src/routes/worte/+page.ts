import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch("/api/words");
  const words = await response.json();
  return { words };
};
