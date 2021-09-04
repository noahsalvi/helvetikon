<script context="module">
  export async function load({ page, fetch }) {
    const { dialect: dialectSlug, word } = page.params;
    const dialect = Object.entries(dialects).find(
      ([_, dialect]) => dialect.slug === dialectSlug
    )?.[0];

    if (!dialect) return;
    const result = await fetch(`/api/words/${dialect}/${word}`);
    const wordData = await result.json();

    return { props: { word: wordData } };
  }
</script>

<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import type { Word } from "@prisma/client";
  import Examples from "./_Examples.svelte";

  import { goto } from "$app/navigation";
  import ButtonBar from "$lib/components/ButtonBar.svelte";
  import api from "$lib/api";
  import { error, success } from "$lib/components/Toaster/toast";
  import dialects from "$lib/dialects";

  export let word: Word;

  let meaning = "";
  let examples: string[] = [];

  let loading = false;

  const submit = async () => {
    loading = true;
    const data = { meaning, examples };
    const path = `/api/words/${word.id}/interpretations`;
    await api
      .post(path, data)
      .then(() => {
        goto(".").then(() => success("Interpretation wurde erstellt 🤝"));
      })
      .catch(() => error());
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

  <section class="mb-3">
    <label for="meaning">Bedeutung</label>
    <textarea
      bind:value={meaning}
      class="textarea"
      type="text"
      id="meaning"
      placeholder="Wird gebraucht um die..."
    />
  </section>

  <Examples bind:examples />

  <ButtonBar on:click={submit} {loading}>Interpretieren</ButtonBar>
</main>

<svelte:head>
  <title>Interpretation Hinzufügen | {word.swissGerman}</title>
</svelte:head>
