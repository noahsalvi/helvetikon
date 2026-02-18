import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import dialects from "$lib/dialects";

export const load: PageLoad = async ({ params, fetch }) => {
  const dialectSlug = params.dialect;
  const word = params.word;
  const dialect = Object.entries(dialects).find(
    ([, dialectEntry]) => dialectEntry.slug === dialectSlug
  )?.[0];

  if (!dialect) {
    throw error(404, "Could not find dialect");
  }

  const result = await fetch(`/api/words/${dialect}/${word}`);
  if (!result.ok) {
    throw error(result.status, await result.text());
  }

  const wordData = await result.json();

  return { word: wordData };
};
