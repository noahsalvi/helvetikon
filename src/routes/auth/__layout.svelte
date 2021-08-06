<script>
  import LogoButton from "$lib/components/LogoButton.svelte";
</script>

<div class="h-screen">
  <header class="px-6 py-5 flex text-xl">
    <LogoButton />
  </header>

  <div class="h-16" />

  <slot />
</div>

<style global>
</style>
