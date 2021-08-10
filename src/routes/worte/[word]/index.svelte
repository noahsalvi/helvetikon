<script context="module">
  export async function load({ page, fetch }) {
    const { word } = page.params;
    const result = await fetch("/api/words/word-" + word);

    if (!result.ok) {
      return { status: result.status };
    }

    const wordData = await result.json();

    return { props: { word: wordData } };
  }
</script>

<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import { faCopy, faPen, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
  import Icon from "$lib/components/Icon";
  import ActionButton from "./components/_ActionButton.svelte";
  import SwissCross from "./components/_SwissCross.svelte";
  import HomeButton from "./components/_HomeButton.svelte";
  import Interpretations from "./components/_Interpretations.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  import type { User, Word, WordInterpretation } from "@prisma/client";

  export let word: Word & {
    createdBy: User;
    interpretations: (WordInterpretation & {
      createdBy: User;
      upvotes: User[];
      downvotes: User[];
    })[];
  };

  const copyURL = () => {
    navigator.clipboard.writeText(location.toString());
  };

  const editWord = () => {
    const path = $page.path + "/bearbeiten";
    goto(path);
  };

  const getMetaSpellingList = () => {
    const length = word.spellings.length - 1;
    return word.spellings.join(", ");
  };
</script>

<SwissCross />

<Nav />
<main class="text-xl">
  <div class="px-3">
    <div class="h-16" />
    <h1 class="font-bold text-5xl text-coal">
      {word.swissGerman}
    </h1>

    {#if word.german}
      <div>
        <span class="text-primaryDark text-xl">(DE) </span>
        <span class="font-bold text-2xl">{word.german}</span>
      </div>
    {/if}

    <div class="mb-4 text-sm italic">
      {#each word.spellings as spelling, index}
        <span>{spelling}{index < word.spellings.length - 1 ? "," : ""} </span>
      {/each}
    </div>

    <!-- Actions -->
    <div class="flex space-x-2 mb-6">
      <ActionButton on:click={null}><Icon data={faVolumeUp} /></ActionButton>
      <ActionButton on:click={copyURL}><Icon data={faCopy} /></ActionButton>
      <!-- <ActionButton on:click={editWord}><Icon data={faPen} /></ActionButton> -->
    </div>

    <hr class="bg-primary h-1 rounded mb-3" />
  </div>

  <Interpretations interpretations={word.interpretations} />
</main>

<HomeButton />

<svelte:head>
  <title>
    {word.swissGerman} ({getMetaSpellingList()}) | Schweizerdeutsches Wörterbuch
  </title>
  {#if word.interpretations.length}
    <meta
      name="description"
      content="(DE){word.german}
      {word.interpretations[0].meaning
        ? `, Bedeutung: ${word.interpretations[0].meaning}`
        : ''}"
    />
  {/if}
</svelte:head>
