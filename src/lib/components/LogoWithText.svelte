<script>
  import config from "$lib/config";
  import Logo from "./Logo.svelte";

  export let href = "/";
  export let logo = true;
</script>

<a {href} class="flex justify-center items-baseline {$$props.class}">
  {#if logo}
    <Logo class="transform translate-y-1 h-10 mr-3" />
  {/if}
  <h1 class="text-3xl font-serif">{config.appName}</h1>
</a>
