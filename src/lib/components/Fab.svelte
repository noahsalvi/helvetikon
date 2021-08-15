<script>
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
  import Icon from "./Icon";

  export let icon = faArrowLeft;
  export let href = "";

  const buttonStyling = `fixed bottom-6 left-6 rounded-full bg-primary h-14 w-14 text-white p-4 shadow-lg`;
</script>

{#if href}
  <a {href} class={buttonStyling}>
    <Icon data={icon} class="!block h-full w-full" />
  </a>
{:else}
  <button class={buttonStyling} on:click>
    <Icon data={icon} class="!block h-full w-full" />
  </button>
{/if}
