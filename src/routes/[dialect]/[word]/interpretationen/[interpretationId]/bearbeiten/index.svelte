<script context="module">
  export async function load({ page, fetch }) {
    const { interpretationId } = page.params;
    const res = await fetch("/api/interpretations/" + interpretationId);
    if (!res.ok) return res;

    const interpretation = await res.json();
    return { props: { interpretation } };
  }
</script>

<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import type { Word, Interpretation, Meaning } from ".prisma/client";
  import Examples from "./_Examples.svelte";
  import { goto } from "$app/navigation";
  import api from "$lib/api";
  import ButtonBar from "$lib/components/ButtonBar.svelte";
  import { success, warn } from "$lib/components/Toaster/toast";
  import { slide } from "svelte/transition";
  import Icon from "$lib/components/Icon";
  import { faTimes } from "@fortawesome/free-solid-svg-icons";

  export let interpretation: Interpretation & {
    word: Word;
    meanings: Meaning[];
  };

  let meanings: { explanation: string; examples: string[] }[] =
    interpretation.meanings;

  let loading = false;

  const submit = async () => {
    loading = true;
    await api
      .put(`/api/interpretations/${interpretation.id}`, meanings)
      .then((_) => {
        goto("../../").then(() => success("Interpretation aktualisiert"));
      })
      .catch((reason) => {
        reason.status === 401 &&
          warn("Du hast nicht die Rechte, um das zu bearbeiten.");
      });

    loading = false;
  };

  const addMeaning = () => {
    meanings = [...meanings, { explanation: "", examples: [] }];
  };

  const deleteMeaning = (index: number) => {
    meanings.splice(index, 1);
    meanings = meanings;
  };

  $: valid =
    meanings.length && !meanings.find((meaning) => !meaning.explanation.length);
</script>

<Nav />

<main class="px-3 text-lg">
  <div class="h-10" />
  <h1 class="font-bold text-5xl text-coal mb-2">
    {interpretation.word.swissGerman}
    {#if interpretation.word.german}
      <span class="text-2xl">= {interpretation.word.german}</span>
    {/if}
  </h1>

  <hr class="bg-primary h-1 rounded mb-3" />

  {#each meanings as meaning, index (meaning)}
    <section
      transition:slide|local
      class="relative mb-3 bg-white rounded p-3 filter drop-shadow"
    >
      <button
        class="absolute right-5 top-1 px-2"
        on:click={() => deleteMeaning(index)}
      >
        <Icon data={faTimes} />
      </button>
      <label for="meaning">Bedeutung</label>
      <textarea
        bind:value={meaning.explanation}
        class="w-full bg-light-300 rounded px-2 py-1"
        type="text"
        id="meaning"
        placeholder="Erklärung auf Hochdeutsch"
      />
      <Examples bind:examples={meaning.examples} />
    </section>
  {/each}
  <button
    on:click={addMeaning}
    class="w-full mb-3 bg-light-100 border-dashed border-2 rounded p-3 text-gray-500 text-center"
  >
    Bedeutung hinzufügen
  </button>

  <div class="h-26" />

  <ButtonBar on:click={submit} {loading} {valid} href="../../">
    Aktualisieren
  </ButtonBar>
</main>

<svelte:head>
  <title>Interpretation Bearbeiten | {interpretation.word.swissGerman}</title>
</svelte:head>
