<script context="module">
  export async function load({ context }) {
    return { props: context };
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import api from "$lib/api";
  import ButtonBar from "$lib/components/ButtonBar.svelte";
  import Icon from "$lib/components/Icon";
  import Nav from "$lib/components/Nav.svelte";
  import { error, success } from "$lib/components/Toaster/toast";
  import dialects from "$lib/dialects";
  import { faTimes } from "@fortawesome/free-solid-svg-icons";
  import type { Word } from "@prisma/client";
  import { slide } from "svelte/transition";
  import Examples from "./_Examples.svelte";

  export let word: Word;

  let meanings: { explanation: string; examples: string[] }[] = [];

  let loading = false;

  const submit = async () => {
    loading = true;
    const path = `/api/words/${word.id}/interpretations`;
    await api
      .post(path, meanings)
      .then(() => {
        goto(".").then(() => success("Interpretation wurde erstellt 🤝"));
      })
      .catch(() => error());
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

<main class="container px-3 text-lg">
  <h1 class="font-bold text-3xl text-coal mb-2">
    {word.swissGerman}
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

  <ButtonBar on:click={submit} {loading} {valid}>Interpretieren</ButtonBar>
</main>

<svelte:head>
  <title>Interpretation Hinzufügen | {word.swissGerman}</title>
</svelte:head>
