<script context="module">
  import dialects from "$lib/dialects";

  export async function load({ page, fetch }) {
    const { dialect: dialectSlug, word } = page.params;

    const dialect = Object.entries(dialects).find(
      ([_, value]) => value.slug === dialectSlug
    )?.[0];

    if (!dialect) return;
    const path = `/api/words/${dialect}/${word}`;
    const result = await fetch(path);

    if (!result.ok) return { status: result.status };

    const wordData = await result.json();

    return { stuff: { word: wordData, path }, props: { path } };
  }
</script>

<script>
  import { session } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";

  export let path;

  onMount(() => {
    $session.invalidate = () => invalidate(path);
  });
</script>

<slot />
