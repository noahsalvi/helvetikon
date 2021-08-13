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

  import Icon from "$lib/components/Icon";
  import Nav from "$lib/components/Nav.svelte";
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import StepGerman from "./steps/_StepGerman.svelte";
  import StepSpellings from "./steps/_StepSpellings.svelte";
  import StepSwissGerman from "./steps/_StepSwissGerman.svelte";

  const data = writable({
    swissGerman: "",
    spellings: [],
    german: "",
    nextStep,
  });

  const steps = [StepSwissGerman, StepSpellings, StepGerman];

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

<main class="add-word">
  <div class="h-5" />
  <div class="text-center text-gray-500">
    Schritt {currentStep + 1} von {steps.length}
  </div>

  <div class="h-5" />

  {#each steps as step, index}
    <div class:hidden={currentStep !== index}>
      <svelte:component this={step} />
    </div>
  {/each}

  <button
    class="fixed bottom-6 left-6
  rounded-full bg-primary h-14 w-14 text-white p-4 shadow-md"
    on:click={() => (currentStep ? previousStep() : goto("/"))}
  >
    <Icon data={faArrowLeft} class="!block h-full w-full" />
  </button>
</main>
