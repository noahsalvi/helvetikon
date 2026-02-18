import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const fetchRecentWords = fetch("/api/words/recent");
  const fetchPopularWords = fetch("/api/words/popular");
  const [recentWordsResponse, popularWordsResponse] = await Promise.all([
    fetchRecentWords,
    fetchPopularWords,
  ]);

  if (!recentWordsResponse.ok || !popularWordsResponse.ok) {
    return { recentWords: undefined, popularWords: undefined };
  }

  const recentWords = await recentWordsResponse.json();
  const popularWords = await popularWordsResponse.json();

  return { recentWords, popularWords };
};
