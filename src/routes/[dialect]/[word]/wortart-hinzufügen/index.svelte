<script context="module" lang="ts">
  export async function load({ page, fetch }) {
    const { dialect: dialectSlug, word } = page.params;
    const dialect = Object.entries(dialects).find(
      ([_, dialect]) => dialect.slug === dialectSlug
    )?.[0];
    if (!dialect) return;

    const result = await fetch(`/api/words/${dialect}/${word}`);
    const wordData: Word = await result.json();

    if (wordData.wordType) return { status: 302, redirect: "./" };

    return { props: { word: wordData } };
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import api from "$lib/api";
  import Fab from "$lib/components/Fab.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import { success } from "$lib/components/Toaster/toast";
  import dialects from "$lib/dialects";
  import wordGenders from "$lib/word-genders";
  import wordTypes from "$lib/word-types";
  import type { Word, WordGender, WordType } from "@prisma/client";

  export let word: Word;
  let selectedWordType: WordType;
  let selectedGender: WordGender;

  function selectType(wordType: WordType) {
    selectedWordType = wordType;
    if (selectedWordType !== "NOUN" || selectedGender) return submit();
  }

  function selectGender(gender: WordGender) {
    selectedGender = gender;
    submit();
  }

  async function submit() {
    const isOkay = confirm(
      `Ist ${word.swissGerman} ein ${wordTypes[selectedWordType].name}?`
    );
    if (!isOkay) return;
    api
      .put(`/api/words/${word.id}/word-type`, {
        wordType: selectedWordType,
        gender: selectedGender,
      })
      .then((res) => {
        goto("./").then(() => success("Wortart hinzugefügt!"));
      });
  }

  $: title = selectedWordType === "NOUN" ? "Genus wählen" : "Wortart wählen";
</script>

<Nav />
<main class="container">
  <div class="h-10" />
  <h1 class="font-semibold text-3xl">
    {title}
  </h1>
  <div class="h-5" />

  {#if selectedWordType == "NOUN"}
    <section class="flex flex-wrap gap-5">
      <button class="word-type" on:click={() => selectGender("MASCULINE")}>
        {wordGenders["MASCULINE"].name}
      </button>
      <button class="word-type" on:click={() => selectGender("FEMININE")}>
        {wordGenders["FEMININE"].name}
      </button>
      <button class="word-type" on:click={() => selectGender("NEUTER")}>
        {wordGenders["NEUTER"].name}
      </button>
      <Fab on:click={() => (selectedWordType = null)} />
    </section>
  {:else}
    <section class="flex flex-wrap gap-5">
      <button class="word-type" on:click={() => selectType("NOUN")}>
        Substantiv
      </button>
      <button class="word-type" on:click={() => selectType("VERB")}>
        Verb
      </button>
      <button class="word-type" on:click={() => selectType("ARTICLE")}>
        Artikel
      </button>
      <button class="word-type" on:click={() => selectType("ADJECTIVE")}>
        Adjektiv
      </button>
      <button class="word-type" on:click={() => selectType("PRONOUN")}>
        Pronomen
      </button>
      <button class="word-type" on:click={() => selectType("NUMERAL")}>
        Numerale
      </button>
    </section>
  {/if}
</main>

<style>
  .word-type {
    width: 200px;
    @apply rounded-xl flex-grow flex font-semibold h-20
      shadow items-center justify-center;
  }
</style>
