<script context="module">
  import dialects from "$lib/dialects";

  export async function load({ page, fetch }) {
    const { dialect: dialectSlug, word } = page.params;

    const dialect = Object.entries(dialects).find(
      ([_, value]) => value.slug === dialectSlug
    )?.[0];

    if (!dialect) return;

    const result = await fetch(`/api/words/${dialect}/${word}`);

    if (!result.ok) {
      return { status: result.status };
    }

    const wordData = await result.json();
    console.log("this is executed");

    return { context: { word: wordData } };
  }
</script>

<slot />
