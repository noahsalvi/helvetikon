<script lang="ts">
  export let title = "";
  export let value = "";
</script>

<div class="flex flex-row">
  <span>{title}</span>
  <input name="title" class="flex-1 px-1 mx-2" type="text" placeholder="—————" bind:value />
</div>
