<script>
  import Icon from "$lib/components/Icon";
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";

  export let valid = true;
  export let loading = false;
  export let text = "Weiter";
</script>

<button
  on:click|preventDefault
  class="bg-primary p-3 w-full rounded-lg text-white font-semibold transition
    disabled:bg-opacity-40"
  disabled={!valid || loading}
>
  {#if loading}
    <Icon data={faSpinner} spin />
  {:else}
    {text}
  {/if}
</button>
