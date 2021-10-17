<script context="module">
  export async function load({ stuff }) {
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
  import { Grammar, Word } from "@prisma/client";
  import { minLength, required, useForm } from "svelte-use-form";

  export let word: Word & { grammar: Grammar };
  const grammar = word.grammar;

  const form = useForm({
    comparative: {
      validators: [minLength(word.swissGerman.length)],
    },
    superlative: {
      validators: [minLength(word.swissGerman.length)],
    },
  });

  function submit() {
    api
      .put(
        `/api/words/${word.id}/adjective-comparative-superlative`,
        $form.values
      )
      .then(() => {
        $session.invalidate();
        goto("./").then(() => success("Adjektiv Steigerung hinzugefügt"));
      })
      .catch(() => error());
  }
</script>

<Nav />
<main>
  <TitleDescriptionLayout>
    <svelte:fragment slot="title">
      Adjektiv Steigerungen hinzufügen
    </svelte:fragment>
    <svelte:fragment slot="description">
      Komparativ und Superlativ für das Adjektiv
      <span class="font-bold text-black">
        {word.swissGerman}
      </span>
      hinzufügen.
    </svelte:fragment>
    <form use:form on:click|preventDefault>
      <label for="comparative">Komparativ</label>
      <input
        class="textfield"
        type="text"
        name="comparative"
        placeholder="schöner"
        value={grammar.adjectiveComparative}
      />
      <div class="h-5" />
      <label for="superlative">Superlativ</label>
      <input
        class="textfield"
        type="text"
        name="superlative"
        placeholder="schönsten"
        value={grammar.adjectiveSuperlative}
      />
      <ButtonBar valid={$form.valid} on:click={submit}>Absenden</ButtonBar>
    </form>
  </TitleDescriptionLayout>
</main>
