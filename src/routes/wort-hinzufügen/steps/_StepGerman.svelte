<script lang="ts">
  import { goto } from "$app/navigation";

  import api from "$lib/api";
  import { error, success } from "$lib/components/Toaster/toast";
  import type { Word } from ".prisma/client";

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
    };

    api
      .post("/api/words", wordData)
      .then((word: Word) => {
        goto("/worte/" + word.swissGerman).then(() =>
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
  <span slot="title">Deutsche Übersetzung (Optional)</span>
  <span slot="description">
    Hat das Wort im Hochdeutschen ein verständliches Gegenstück?
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
</StepLayout>
