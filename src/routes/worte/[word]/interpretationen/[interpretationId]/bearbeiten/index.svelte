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
  import type { Word, WordInterpretation } from ".prisma/client";
  import Examples from "./_Examples.svelte";
  import { goto } from "$app/navigation";
  import api from "$lib/api";
  import ButtonBar from "$lib/components/ButtonBar.svelte";
  import { success, warn } from "$lib/components/Toaster/toast";

  export let interpretation: WordInterpretation & { word: Word };

  let loading = false;

  const submit = async () => {
    loading = true;
    await api
      .put(`/api/interpretations/${interpretation.id}`, {
        meaning: interpretation.meaning,
        examples: interpretation.examples,
      })
      .then((_) => {
        goto("../../").then(() => success("Interpretation aktualisiert"));
      })
      .catch((reason) => {
        warn(
          reason.status === 401 &&
            "Du hast nicht die Rechte, um das zu bearbeiten."
        );
      });

    loading = false;
  };
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

  <section class="mb-3">
    <label for="meaning">Bedeutung</label>
    <textarea
      class="textarea"
      type="text"
      id="meaning"
      bind:value={interpretation.meaning}
    />
  </section>

  <Examples bind:examples={interpretation.examples} />

  <ButtonBar
    on:click={submit}
    {loading}
    href="../../"
    valid={!!interpretation.meaning.length}
  >
    Aktualisieren
  </ButtonBar>
</main>

<svelte:head>
  <title>Interpretation Bearbeiten | {interpretation.word.swissGerman}</title>
</svelte:head>
