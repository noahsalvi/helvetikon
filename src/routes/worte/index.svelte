<script context="module" lang="ts">
  export async function load({ fetch }) {
    const response = await fetch("/api/words");
    const words = await response.json();
    return { props: { words } };
  }
</script>

<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import dialects from "$lib/dialects";
  import type { Word } from "@prisma/client";

  export let words: Word[];
</script>

<Nav />
<main class="px-6 mt-10">
  <h1 class="font-bold text-4xl text-coal">Alle Wörter</h1>
  <h2 class="text-xl text-gray-500">Total: {words.length}</h2>

  <div class="h-6" />

  <div
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-w-6xl mx-auto gap-4"
  >
    {#each words as word, index}
      <a
        class="text-primary font-semibold text-xl break-words"
        href="/{dialects[word.dialect].slug}/{word.swissGerman}"
        >{index + 1}. {word.swissGerman}</a
      >
    {/each}
  </div>
</main>

<svelte:head>
  <title>Alle Wörter</title>
</svelte:head>
