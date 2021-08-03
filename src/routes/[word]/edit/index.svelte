<script context="module">
  export async function load({ page, fetch }) {
    const { word } = page.params;
    const result = await fetch("/api/words/word-" + word);
    const wordData = await result.json();

    return { props: { word: wordData } };
  }
</script>

<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import type { Word } from ".prisma/client";
  import NavigationButtons from "./_NavigationButtons.svelte";
  import Examples from "./_Examples.svelte";
  import Spellings from "./_Spellings.svelte";
  import { goto } from "$app/navigation";

  export let word: Word;

  let loading = false;

  const submit = async () => {
    loading = true;
    await fetch("/api/words/" + word.id, {
      body: JSON.stringify(word),
      method: "PUT",
    }).then(() => {
      goto("./");
    });

    loading = false;
  };
</script>

<Nav />

<main class="px-3 text-lg">
  <div class="h-10" />
  <h1 class="font-bold text-[38px] text-coal mb-2">
    {word.swissGerman}
  </h1>

  <hr class="bg-primary h-1 rounded mb-3" />

  <Spellings bind:spellings={word.spellings} />

  <section class="mb-3">
    <label for="german">Deutsche Übersetzung</label>
    <input class="textfield" type="text" id="german" bind:value={word.german} />
  </section>

  <section class="mb-3">
    <label for="meaning">Bedeutung</label>
    <textarea
      class="textarea"
      type="text"
      id="meaning"
      bind:value={word.meanings[0]}
    />
  </section>

  <Examples bind:examples={word.examples} />

  <NavigationButtons on:click={submit} {loading} />
</main>

<style>
  label {
    @apply text-sm;
  }
</style>
