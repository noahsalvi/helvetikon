<script>
  import Icon from "$lib/components/Icon";
  import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";

  export let loading;
  export let disabled;
</script>

<!-- Placeholder -->
<div class="h-26" />

<div class="flex items-center h-13 gap-2 fixed bottom-4 px-2 left-0 w-full">
  <a
    href="./"
    class="bg-primary h-13 w-13 rounded-full p-4 text-white filter drop-shadow-xl flex justify-center items-center"
  >
    <Icon data={faArrowLeft} class="w-full h-full" />
  </a>

  <button
    on:click
    class="bg-primary text-white h-full flex-grow rounded-4xl filter drop-shadow-xl disabled:bg-opacity-70"
    disabled={loading || disabled}
  >
    {#if loading}
      <Icon data={faSpinner} spin scale={1.5} />
    {:else}
      Erstellen
    {/if}
  </button>
</div>
