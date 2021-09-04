<script lang="ts">
  import api from "$lib/api";
  import { error } from "$lib/components/Toaster/toast";
  import dialects from "$lib/dialects";
  import { Dialect } from "$lib/prisma-browser";
  import type { Word, Dialect as DialectType } from "@prisma/client";
  import { getContext } from "svelte";
  import { Hint, maxLength, required, useForm } from "svelte-use-form";
  import type { Writable } from "svelte/store";
  import StepButton from "../components/_StepButton.svelte";
  import StepLayout from "../components/_StepLayout.svelte";

  const data: Writable<any> = getContext("add-word-data");

  const form = useForm({
    swissGerman: { validators: [required, maxLength(20)] },
  });

  let loading = false;

  const checkAvailability = () => {
    loading = true;

    const swissGerman = $form.swissGerman.value;
    const dialect: DialectType = $data.dialect;
    api
      .get(`/api/words/available/${dialect}/${swissGerman}`)
      .then(() => $data.nextStep())
      .catch(async (reason) => {
        if (reason.status === 409) {
          const word: Word = await reason.json();
          error(`"${swissGerman}" gibt es schon 😬`, 4000, {
            href: `/worte/${word.swissGerman}`,
            title: "Ansehen",
          });
        } else error();
      })
      .finally(() => (loading = false));
  };

  $: selectedDialect =
    $data.dialect === Dialect.OTHER
      ? ""
      : `${dialects[$data.dialect as DialectType]?.name}e`.toLowerCase();
</script>

<StepLayout>
  <span slot="title">Wie heisst das Wort?</span>
  <span slot="description">
    Das {selectedDialect} Wort, das du erfassen willst. <br />
    <ul class="list-disc ml-6">
      <li>
        Achte dich auf die
        <a
          class="underline"
          href="https://www.duden.de/sprachwissen/rechtschreibregeln/Gro%C3%9F-%20und%20Kleinschreibung"
        >
          Grossschreibung
        </a>
      </li>
      <li>Wähle die populärste Schreibweise</li>
    </ul>
  </span>
  <form use:form>
    <input
      type="text"
      name="swissGerman"
      class="textfield"
      placeholder="Öpfu"
      bind:value={$data.swissGerman}
    />
    <Hint for="swissGerman" on="maxLength">
      Darf nicht länger als 20 Zeichen sein.
    </Hint>

    <div class="h-5" />

    <StepButton on:click={checkAvailability} valid={$form.valid} {loading} />
  </form>
</StepLayout>
