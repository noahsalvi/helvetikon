<script>
  import Icon from "$lib/components/Icon";
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";

  export let loading = false;
  export let valid = true;
</script>

<button
  on:click
  disabled={!valid || loading}
  class="w-full h-14 bg-primary rounded-lg text-white font-semibold text-xl 
  {loading
    ? ''
    : 'disabled:(bg-opacity-50 cursor-not-allowed)'} {$$props.class}"
>
  {#if loading}
    <Icon data={faSpinner} spin />
  {:else}
    <slot />
  {/if}
</button>
