<script lang="ts">
  import Spellings from "../components/_Spellings.svelte";
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import StepButton from "../components/_StepButton.svelte";
  import StepLayout from "../components/_StepLayout.svelte";

  const data: Writable<any> = getContext("add-word-data");

  let loading = false;
</script>

<StepLayout>
  <span slot="title">Alternative Schreibwesen</span>
  <span slot="description">
    Gibt es noch andere Arten das Wort "{$data.swissGerman}" zu schreiben?
    <ul class="list-disc list-inside">
      <li>
        Hier geht es um kleinere Abweichungen.
        <div class="text-green-500">Bsp. Öpfu: Öpfel, Apfu, Epfel</div>
        <div class="text-red-500">Bsp. Modi: Meitli, Mäitschi, Epfel</div>
      </li>
      <li>
        Weiteres Beispiel: Modi und Meitli unterscheiden sich zu fest, um als
        alternative Schreibweise zu gelten
      </li>
    </ul>
  </span>
  <Spellings bind:spellings={$data.spellings} />

  <div class="h-5" />

  <StepButton on:click={$data.nextStep} {loading} />
</StepLayout>
