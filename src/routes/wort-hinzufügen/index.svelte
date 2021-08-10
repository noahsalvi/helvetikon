<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import Spellings from "./_Spellings.svelte";
  import { goto } from "$app/navigation";
  import { required, useForm } from "svelte-use-form";
  import type { Word } from ".prisma/client";
  import FloatingButton from "$lib/components/FloatingButton.svelte";
  import { error, success } from "$lib/components/Toaster/toast";
  import api from "$lib/api";

  const placeholder = "Öpfu";
  const form = useForm({
    swissGerman: { validators: [required] },
    german: { validators: [] },
  });

  let swissGerman = "";
  let german = "";
  let spellings = [];

  let loading = false;

  const submit = async () => {
    loading = true;
    await api
      .post("/api/words", { swissGerman, german, spellings })
      .then((word: Word) => {
        const path = `/worte/${word.swissGerman}`;
        goto(path).then(() => success(`Wort wurde erstellt 🎉`));
      })
      .catch((reason) => {
        error(reason.status === 409 && "Wort existiert bereits 😕");
      });

    loading = false;
  };
</script>

<Nav />

<main class="px-3 text-lg">
  <form use:form>
    <div class="h-10" />
    <h1 class="font-bold h-[38px] text-[38px] text-coal mb-2">
      {swissGerman ? swissGerman : placeholder}
    </h1>

    <hr class="bg-primary h-1 rounded mb-3" />

    <section class="mb-3">
      <label for="swiss-german">Wort</label>
      <input
        {placeholder}
        bind:value={swissGerman}
        class="textfield"
        type="text"
        id="swiss-german"
        name="swissGerman"
      />
    </section>

    <Spellings bind:spellings />
    <section class="mb-3">
      <label for="german">Deutsche Übersetzung</label>
      <input
        bind:value={german}
        class="textfield"
        type="text"
        id="german"
        placeholder="Apfel"
        name="german"
      />
    </section>
  </form>

  <FloatingButton on:click={submit} {loading} valid={$form.valid}>
    Erstellen
  </FloatingButton>
</main>

<svelte:head>
  <title>Wort Hinzufügen</title>
</svelte:head>
