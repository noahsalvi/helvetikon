<script context="module" lang="ts">
  export async function load({ stuff }) {
    const word = stuff.word;
    if (word.wordType) return { status: 302, redirect: "./" };

    return { props: { word } };
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";
  import api from "$lib/api";
  import Fab from "$lib/components/Fab.svelte";
  import TitleDescriptionLayout from "$lib/components/layouts/TitleDescriptionLayout.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import { success } from "$lib/components/Toaster/toast";
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
      .then(() => {
        $session.invalidate();
        goto("./").then(() => success("Wortart hinzugefügt!"));
      });
  }

  $: title = selectedWordType === "NOUN" ? "Genus wählen" : "Wortart wählen";
</script>

<Nav />
<main>
  <TitleDescriptionLayout>
    <svelte:fragment slot="title">
      {title}
    </svelte:fragment>
    <svelte:fragment slot="description">
      Wähle die Wortart für das Wort
      <span class="font-bold text-black">{word.swissGerman}</span>
      . Falls du dir unsicher bist, kannst du für Worte die es auch im Deutschen
      gibt, auf Duden nachschauen. Alle unveränderlichen Wortarten gehören zu der
      Wortart Partikel
    </svelte:fragment>

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
        <Fab
          on:click={() => {
            selectedWordType = null;
            selectedGender = null;
          }}
        />
      </section>
    {:else}
      <section class="flex flex-wrap gap-5">
        <button class="word-type" on:click={() => selectType("NOUN")}>
          {wordTypes["NOUN"].name}
        </button>
        <button class="word-type" on:click={() => selectType("VERB")}>
          {wordTypes["VERB"].name}
        </button>
        <button class="word-type" on:click={() => selectType("ARTICLE")}>
          {wordTypes["ARTICLE"].name}
        </button>
        <button class="word-type" on:click={() => selectType("ADJECTIVE")}>
          {wordTypes["ADJECTIVE"].name}
        </button>
        <button class="word-type" on:click={() => selectType("PRONOUN")}>
          {wordTypes["PRONOUN"].name}
        </button>
        <button class="word-type" on:click={() => selectType("NUMERAL")}>
          {wordTypes["NUMERAL"].name}
        </button>
        <button class="word-type" on:click={() => selectType("PARTICLE")}>
          {wordTypes["PARTICLE"].name}
        </button>
      </section>
    {/if}
  </TitleDescriptionLayout>
</main>

<style>
  .word-type {
    width: 200px;
    @apply rounded-xl flex-grow flex font-semibold h-20
      shadow items-center justify-center;
  }
</style>
