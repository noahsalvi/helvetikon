<script context="module" lang="ts">
  export async function load({ page }) {
    const wordPage = page.path.match(/\//g).length === 2;
    if (wordPage) return {};
  }
</script>

<script>
  import { page } from "$app/stores";
  import Nav from "$lib/components/Nav.svelte";

  const word = $page.params.word;
</script>

<Nav />
<h1 class="text-4xl text-center mt-20 px-6">
  Wort <span class="text-primary">"{word}"</span> wurde nicht gefunden :&NoBreak;(
</h1>
