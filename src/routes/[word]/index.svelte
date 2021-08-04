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
  import type { Word } from "$lib/models/word";
  import { faCopy, faPen, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
  import Icon from "$lib/components/Icon";
  import ActionButton from "./_ActionButton.svelte";
  import SwissCross from "./_SwissCross.svelte";
  import HomeButton from "./_HomeButton.svelte";
  import Example from "./_Example.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let word: Word;

  const copyURL = () => {
    navigator.clipboard.writeText(location.toString());
  };

  const editWord = () => {
    const path = $page.path + "/edit";
    goto(path);
  };
</script>

<SwissCross />

<Nav />
<main class="px-3 text-xl">
  <div class="h-20" />
  <h1 class="font-bold text-5xl text-coal">
    {word.swissGerman}
  </h1>

  <div class="mb-4 text-2xl">
    = {word.german}
  </div>

  <!-- Actions -->
  <div class="flex space-x-2 mb-6">
    <ActionButton on:click={null}><Icon data={faVolumeUp} /></ActionButton>
    <ActionButton on:click={copyURL}><Icon data={faCopy} /></ActionButton>
    <ActionButton on:click={editWord}><Icon data={faPen} /></ActionButton>
  </div>

  <hr class="bg-primary h-1 rounded mb-3" />

  <div class="text-sm">
    <span class="font-bold">Schreibweisen:</span>
    {#each word.spellings as spelling}
      <span>{spelling} &nbsp;</span>
    {/each}
  </div>

  <!-- <section class="mt-6 mb-4">
    <h2>Bedeutung</h2>
    <div class="font-bold">{word.meanings[0]}</div>
  </section>

  <section class="mb-4">
    <h2>Beispiel</h2>
    <div class="font-bold italic">"{word.examples[0]}"</div>

    <Example examples={word.examples} />
  </section> -->

  <!-- <section class="mb-4">
    <h2>Synonyme</h2>
    <div class="font-bold">{word.meanings[0].value}</div>
  </section> -->
</main>

<HomeButton />
