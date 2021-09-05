<script lang="ts">
  import { goto } from "$app/navigation";
  import api from "$lib/api";
  import { error, success } from "$lib/components/Toaster/toast";
  import dialects from "$lib/dialects";
  import type { Word } from "@prisma/client";
  import { getContext } from "svelte";
  import { Hint, maxLength, useForm } from "svelte-use-form";
  import type { Writable } from "svelte/store";
  import StepButton from "../components/_StepButton.svelte";
  import StepLayout from "../components/_StepLayout.svelte";

  const data: Writable<any> = getContext("add-word-data");

  const form = useForm({
    german: { validators: [maxLength(20)] },
  });

  let loading = false;

  function createWord() {
    loading = true;

    const wordData = {
      swissGerman: $data.swissGerman,
      german: $data.german,
      spellings: $data.spellings,
      dialect: $data.dialect,
    };

    api
      .post("/api/words", wordData)
      .then((word: Word) => {
        goto(`/${dialects[word.dialect].slug}/${word.swissGerman}`).then(() =>
          success("Wort wurde erstellt 🎉")
        );
      })

      .catch(() => {
        error();
        loading = false;
      });
  }
</script>

<StepLayout>
  <span slot="title">Deutsche Übersetzung</span>
  <span slot="description">
    Hat das Wort im Hochdeutschen ein <span class="font-semibold"
      >korrektes</span
    >
    Gegenstück?
    <ul class="list-disc ml-6">
      <li>Optionale Angabe</li>
      <li>
        Achte dich auf die
        <a
          class="underline"
          href="https://www.duden.de/sprachwissen/rechtschreibregeln/Gro%C3%9F-%20und%20Kleinschreibung"
        >
          Grossschreibung
        </a>
      </li>
    </ul>
  </span>
  <form use:form>
    <input
      type="text"
      name="german"
      class="textfield"
      placeholder="Apfel"
      bind:value={$data.german}
    />
    <Hint for="german" on="maxLength">
      Darf nicht länger als 20 Zeichen sein.
    </Hint>

    <div class="h-5" />

    <StepButton
      text="Erstellen"
      on:click={createWord}
      valid={$form.valid}
      {loading}
    />
  </form>

  <div class="h-5" />

  <div class="text-gray-500 bg-light-300 p-3 rounded-lg">
    Im nächsten Schritt können Bedeutungen und Beispielsätze erfasst werden.
    (Interpretation)
  </div>
</StepLayout>
