<script lang="ts">
  import { VerbConjucation } from "@prisma/client";
  import { useForm } from "svelte-use-form";
  import ConjugationInput from "./ConjugationInput.svelte";

  export let conjugation: VerbConjucation;
  export let title: String;

  const form = useForm();

  // let isNew = !!conjugation.id;
  let isNew = false; // TODO remove this
</script>

{#if isNew}
  <div
    on:click={() => (isNew = false)}
    class="py-6 px-3 text-center cursor-pointer flex-grow rounded-lg border-3 border-dashed border-light-800 shadow"
  >
    {title} hinzufügen
  </div>
{:else}
  <article
    class="bg-white flex-grow p-3 rounded-lg bg-white border-3 border-light-300 shadow"
  >
    <h2>{title}</h2>
    <form use:form>
      <ConjugationInput title="1. Sg." />
      <ConjugationInput title="2. Sg." />
      <ConjugationInput title="3. Sg." />
    </form>
  </article>
{/if}
