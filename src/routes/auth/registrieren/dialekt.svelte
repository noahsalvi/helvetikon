<script lang="ts">
  import { goto } from "$app/navigation";

  import dialects from "$lib/dialects";
  import DialectItem from "../../wort-hinzufügen/components/_DialectItem.svelte";
  import StepLayout from "../../wort-hinzufügen/components/_StepLayout.svelte";
  import { registrationState } from "./registrationState";

  const selectDialect = (key: string) => {
    $registrationState.dialect = key;
    goto("./");
  };
</script>

<StepLayout>
  <span slot="title">Dialekt</span>
  <span slot="description">
    Was ist dein alltags Dialekt? Falls du noch keinen richtigen Dialekt oder
    sogar schon mehrere Dialekte hast, kannst du den angeben, für welchen du
    dich mehr interessierst. Diese Information wird genutzt, um die
    Suchresultate u. Ä. für dich zu optimieren.
  </span>

  <ul class="flex flex-col gap-2">
    {#each Object.entries(dialects) as [key, dialect]}
      <DialectItem on:click={() => selectDialect(key)} {...dialect} />
    {/each}
  </ul>

  <div class="h-26" />
</StepLayout>
