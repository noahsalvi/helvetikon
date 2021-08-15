<script lang="ts">
  import api from "$lib/api";
  import { error } from "$lib/components/Toaster/toast";
  import type { Word } from ".prisma/client";

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
    api
      .get("/api/words/available/" + swissGerman)
      .then(() => $data.nextStep())
      .catch(async (reason) => {
        if (reason.status === 409) {
          const word: Word = await reason.json();
          error(`"${swissGerman}" gibt es schon 😬`, 4000, {
            href: `/worte/${word.swissGerman}`,
            title: "Ansehen",
          });
        }
      })
      .finally(() => (loading = false));
  };
</script>

<StepLayout>
  <span slot="title">Wie heisst das Wort?</span>
  <span slot="description">
    Das Schweizerdeutsche Wort, das du erfassen willst. <br />
    <ul class="list-disc list-inside">
      <li>
        Achte dich auf die
        <a
          class="underline"
          href="https://www.duden.de/sprachwissen/rechtschreibregeln/Gro%C3%9F-%20und%20Kleinschreibung"
        >
          Gross- und Kleinschreibung
        </a>
      </li>
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
