<script>
  export let title;
  export let value;
  export let href = "";
</script>

<div class="flex">
  <div class="min-w-30">{title}</div>
  {#if href}
    <a {href}>
      <div class="font-bold">{value}</div>
    </a>
  {:else}
    <div class="font-bold">{value}</div>
  {/if}
</div>
