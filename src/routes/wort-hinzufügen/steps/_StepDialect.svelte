<script lang="ts">
  import { session } from "$app/stores";
  import dialects from "$lib/dialects";
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import DialectItem from "../components/_DialectItem.svelte";

  import StepLayout from "../components/_StepLayout.svelte";

  const data: Writable<any> = getContext("add-word-data");
  const preferredDialect = $session.user.preferredDialect;
  const sortedDialects = Object.assign({ [preferredDialect]: null }, dialects);

  const selectDialect = (key: string) => {
    $data.dialect = key;
    $data.nextStep();
  };
</script>

<StepLayout>
  <span slot="title">Dialekt</span>
  <span slot="description">
    Für welchen Dialekt willst du ein Wort erfassen?
  </span>

  <ul class="flex flex-col gap-2">
    {#each Object.entries(sortedDialects) as [key, dialect]}
      <DialectItem
        on:click={() => selectDialect(key)}
        {...dialect}
        preferred={key === preferredDialect}
      />
    {/each}
  </ul>

  <div class="h-26" />
</StepLayout>
