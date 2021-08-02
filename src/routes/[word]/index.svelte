<script context="module">
  export async function load({ page, fetch }) {
    const { word } = page.params;
    const result = await fetch("/api/words/" + word);
    const wordData = await result.json();

    return { props: { word: wordData } };
  }
</script>

<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import type { Word } from "$lib/models/word";
  import ActionButton from "./_ActionButton.svelte";
  import { faCopy, faPen, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
  import ReturnButton from "./_ReturnButton.svelte";
  import SwissCross from "./_SwissCross.svelte";
  import Icon from "$lib/components/Icon";
  import Example from "./_Example.svelte";

  export let word: Word;

  const copyURL = () => {
    navigator.clipboard.writeText(location.toString());
  };
</script>

<ReturnButton />

<SwissCross />

<Nav />
<main class="px-3 text-lg">
  <div class="h-40" />
  <h1 class="font-bold text-[38px] text-coal">
    {word.swissGerman}
  </h1>

  <div class="font-bold mb-4">
    = {word.german}
  </div>

  <!-- Actions -->
  <div class="flex space-x-2 mb-3">
    <ActionButton on:click={null}><Icon data={faVolumeUp} /></ActionButton>
    <ActionButton on:click={copyURL}><Icon data={faCopy} /></ActionButton>
    <ActionButton on:click={null}><Icon data={faPen} /></ActionButton>
  </div>

  <hr class="bg-primary h-1 rounded mb-3" />

  <div class="text-sm">
    Schreibweisen:
    {#each word.spellings as spelling}
      <span>{spelling.value}</span>
    {/each}
  </div>

  <section class="mt-6 mb-4">
    <h2>Beispiel</h2>
    <div class="font-bold italic">"{word.examples[0].value}"</div>

    {#if word.examples.length > 1}
      <Example examples={word.examples} />
    {/if}
  </section>

  <section class="mb-4">
    <h2>Bedeutung</h2>
    <div class="font-bold">{word.meanings[0].value}</div>
  </section>

  <!-- <section class="mb-4">
    <h2>Synonyme</h2>
    <div class="font-bold">{word.meanings[0].value}</div>
  </section> -->
</main>
