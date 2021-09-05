<script>
  import config from "$lib/config";
  import Logo from "./Logo.svelte";

  export let href = "/";
  export let logo = true;
</script>

<a {href} class="flex justify-center items-end {$$props.class}">
  {#if logo}
    <Logo class="h-10 mr-3" />
  {/if}
  <h1 class="text-3xl font-serif leading-none">{config.appName}</h1>
</a>
