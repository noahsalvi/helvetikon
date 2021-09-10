<script context="module">
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

    return { props: { word: wordData } };
  }
</script>

<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import {
    faHome,
    faShare,
    faVolumeUp,
  } from "@fortawesome/free-solid-svg-icons";
  import Icon from "$lib/components/Icon";
  import ActionButton from "./components/_ActionButton.svelte";
  import SwissCross from "./components/_SwissCross.svelte";
  import Interpretations from "./components/_Interpretations.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  import type { User, Word, Interpretation, Meaning } from "@prisma/client";
  import Fab from "$lib/components/Fab.svelte";
  import dialects from "$lib/dialects";
  import { metaContent } from "$lib/utils/meta-content";
  import config from "$lib/config";

  export let word: Word & {
    createdBy: User;
    interpretations: (Interpretation & {
      createdBy: User;
      upvotes: User[];
      downvotes: User[];
      meanings: Meaning[];
    })[];
  };

  const share = () => {
    navigator.share({ url: location.toString() });
  };

  const getMetaSpellingList = () => {
    const spellingsList = word.spellings.join(", ");
    return spellingsList && `(${spellingsList}) `;
  };
</script>

<!-- <SwissCross /> -->

<Nav />
<main class="container">
  <div class="px-3">
    <div class="h-10" />
    <div
      class="text-sm font-semibold bg-light-200 rounded flex w-min px-2 py-1"
    >
      {dialects[word.dialect].name}
    </div>

    <div class="h-3" />
    <h1 class="font-bold text-5xl text-coal break-words">
      {word.swissGerman}
    </h1>

    <div class="text-lg font-semibold italic">
      {#each word.spellings as spelling, index}
        <span>{spelling}{index < word.spellings.length - 1 ? "," : ""} </span>
      {/each}
    </div>

    {#if word.german}
      <a href="https://www.duden.de/rechtschreibung/{word.german}">
        <h2 class="text-2xl">
          <span class="text-primaryDark ">(DE)</span>
          <span class="font-bold">{word.german}</span>
        </h2>
      </a>
    {/if}

    <div class="h-4" />

    <!-- Actions -->
    <div class="flex space-x-2 mb-6">
      <ActionButton on:click={null}><Icon data={faVolumeUp} /></ActionButton>
      <ActionButton on:click={share}><Icon data={faShare} /></ActionButton>
      <!-- <ActionButton on:click={editWord}><Icon data={faPen} /></ActionButton> -->
    </div>

    <hr class="bg-primary h-1 rounded mb-3" />
  </div>

  <Interpretations interpretations={word.interpretations} />
</main>
<Fab icon={faHome} href="/" />

<svelte:head>
  <title>
    {word.swissGerman}&nbsp;{getMetaSpellingList()}- {config.appName}
  </title>

  <meta
    name="description"
    content="{metaContent('Deutsch: ## | ', word.german)}{metaContent(
      '## | ',
      word.interpretations[0]?.meanings[0]?.explanation
    )}{metaContent('Dialekt: ##', dialects[word.dialect].name)}"
  />
</svelte:head>
