<script lang="ts">
  import { VerbConjucation } from "@prisma/client";

  export let conjugation: VerbConjucation;
  export let title: String;

  function addConjugation() {}
</script>

{#if !conjugation}
  <div
    class="py-6 px-3 text-center cursor-pointer flex-grow rounded-lg border-3 border-dashed border-light-800 shadow"
  >
    {title} hinzufügen
  </div>
{:else}
  <article
    class="bg-white flex-grow p-3 rounded-lg bg-white border-3 border-light-300 shadow"
  >
    <h1>{title}</h1>
    Konjugation
  </article>
{/if}
