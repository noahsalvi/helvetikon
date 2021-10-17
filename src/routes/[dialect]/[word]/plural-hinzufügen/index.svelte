<script context="module" lang="ts">
  export async function load({ session, stuff }) {
    if (!session.user) return { status: 302, redirect: "/auth" };

    return { props: stuff };
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";
  import api from "$lib/api";
  import ButtonBar from "$lib/components/ButtonBar.svelte";
  import TitleDescriptionLayout from "$lib/components/layouts/TitleDescriptionLayout.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import { error, success } from "$lib/components/Toaster/toast";
  import { Word } from "@prisma/client";

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

<main>
  <TitleDescriptionLayout>
    <svelte:fragment slot="title">Plural hinzufügen</svelte:fragment>
    <svlete:fragment slot="description">
      Füge die plurale Form vom Wort {word.swissGerman} hinzu.
    </svlete:fragment>
    <form on:submit|preventDefault>
      <input class="textfield" type="text" placeholder="Mönschä" bind:value />
      <div class="h-5" />
      <ButtonBar {valid} on:click={submit}>Absenden</ButtonBar>
    </form>
  </TitleDescriptionLayout>
</main>
