<script lang="ts">
  import Spellings from "../components/_Spellings.svelte";
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import StepButton from "../components/_StepButton.svelte";
  import StepLayout from "../components/_StepLayout.svelte";
  import dialects from "$lib/dialects";

  const data: Writable<any> = getContext("add-word-data");

  let loading = false;
</script>

<StepLayout>
  <span slot="title">Alternative Schreibwesen</span>
  <span slot="description">
    Gibt es noch andere Arten das Wort "{$data.swissGerman}" zu schreiben?
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
      <li>Kleinere Abweichungen</li>
      <li>Nur {dialects[$data.dialect]?.name} ist relevant</li>
      <li>
        Bsp. <span class="font-semibold">Zwätschgä</span>: Zwetschgä, Zwetschge
      </li>
    </ul>
  </span>
  <Spellings bind:spellings={$data.spellings} />

  <div class="h-5" />

  <StepButton on:click={$data.nextStep} {loading} />
</StepLayout>
