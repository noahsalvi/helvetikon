<script>
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
  import Icon from "./Icon";

  export let icon = faArrowLeft;
  export let href = "";
  export let invert = false;

  const buttonStyling = `fixed z-10 bottom-6 left-6 rounded-full h-14 w-14 p-4 shadow-lg 
  ${invert ? "bg-white text-primary" : "bg-primary text-white"}`;
</script>

{#if href}
  <a {href} class={buttonStyling} aria-label="Floating Action Button">
    <Icon data={icon} class="!block h-full w-full" />
  </a>
{:else}
  <button class={buttonStyling} on:click>
    <Icon data={icon} class="!block h-full w-full" />
  </button>
{/if}
