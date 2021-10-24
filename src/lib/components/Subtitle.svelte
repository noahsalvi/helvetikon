<script lang="ts">
  export let spaceBottom = true;
</script>

<div class="relative inline-flex">
  <h2 class="font-bold text-xl"><slot /></h2>
  <div class="h-0.8 w-full bg-black rounded absolute bottom-0" />
</div>
{#if spaceBottom}
  <div class="h-4" />
{/if}
