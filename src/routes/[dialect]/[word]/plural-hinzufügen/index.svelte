<script context="module" lang="ts">
  import ButtonBar from "$lib/components/ButtonBar.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import { Word } from "@prisma/client";
  import StepLayout from "../../../wort-hinzufügen/components/_StepLayout.svelte";

  export async function load({ session, context }) {
    if (!session.user) return { status: 302, redirect: "/auth" };

    return { props: context };
  }
</script>

<script lang="ts">
  import api from "$lib/api";
  import { goto, invalidate } from "$app/navigation";
  import { error, success } from "$lib/components/Toaster/toast";
  import { session } from "$app/stores";

  export let word: Word;
  let value = "";

  $: valid = value.length > 1;

  function submit() {
    api
      .put(`/api/words/${word.id}/noun-plural`, { nounPlural: value })
      .then(async () => {
        $session.invalidate();
        goto("./").then(() => success("Plural wurde hinzugefügt"));
      })
      .catch(() => error());
  }
</script>

<Nav />

<main class="container">
  <StepLayout>
    <svelte:fragment slot="title">Plural hinzufügen</svelte:fragment>
    <svlete:fragment slot="description">
      Füge die plurale Form vom Wort {word.swissGerman} hinzu.
    </svlete:fragment>
    <form on:submit|preventDefault>
      <input class="textfield" type="text" placeholder="Mönschä" bind:value />
      <div class="h-5" />
      <ButtonBar {valid} on:click={submit}>Absenden</ButtonBar>
    </form>
  </StepLayout>
</main>
