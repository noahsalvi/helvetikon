<script context="module">
  export async function load({ session }) {
    if (!session.user) {
      return { status: 302, redirect: "/auth/anmelden" };
    }
    return {};
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import Fab from "$lib/components/Fab.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import StepDialect from "./steps/_StepDialect.svelte";
  import StepGerman from "./steps/_StepGerman.svelte";
  import StepSpellings from "./steps/_StepSpellings.svelte";
  import StepSwissGerman from "./steps/_StepSwissGerman.svelte";

  const data = writable({
    swissGerman: "",
    spellings: [],
    german: "",
    dialect: null,
    nextStep,
  });

  const steps = [StepDialect, StepSwissGerman, StepSpellings, StepGerman];

  let currentStep = 0;

  function nextStep() {
    currentStep += 1;
  }

  function previousStep() {
    currentStep -= 1;
  }

  setContext("add-word-data", data);
  ("hidden");
</script>

<Nav />

<main class="container add-word">
  <div class="text-center text-gray-500">
    Schritt {currentStep + 1} von {steps.length}
  </div>

  <div class="h-5" />

  {#each steps as step, index}
    <div class:hidden={currentStep !== index}>
      <svelte:component this={step} />
    </div>
  {/each}

  <Fab on:click={() => (currentStep ? previousStep() : goto("/"))} />
</main>
