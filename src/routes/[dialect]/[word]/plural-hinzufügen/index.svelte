<script context="module" lang="ts">
  import StepLayout from "../../../wort-hinzufügen/components/_StepLayout.svelte";

  export async function load({ session, context }) {
    if (!session.user) return { status: 302, redirect: "/auth" };

    return { props: context };
  }
</script>

<script>
  import Nav from "$lib/components/Nav.svelte";

  export let word;
</script>

<Nav />

<StepLayout>
  <svelte:fragment slot="title">Plural hinzufügen</svelte:fragment>
  <svlete:fragment slot="description"
    >Füge die plurale Form vom Wort {word.swissGerman} hinzu</svlete:fragment
  >
</StepLayout>
