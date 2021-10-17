<script lang="ts">
  import Icon from "$lib/components/Icon";
  import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
  import { slide } from "svelte/transition";

  export let examples: string[];
  // Remove the first example which already gets displayed somewhere else
  examples = examples.slice(1);

  let collapsed = true;

  const toggle = () => (collapsed = !collapsed);
</script>

{#if examples.length}
  <div
    on:click={toggle}
    class="has-pointer-event bg-hint mt-3 py-2 px-4 rounded"
  >
    <div class="flex items-center">
      <Icon data={collapsed ? faPlus : faMinus} class="mr-2" />
      {collapsed ? "Mehr Beispiele" : "Minimieren"}
    </div>
    {#if !collapsed}
      <div class="mt-2" transition:slide|local>
        {#each examples as example}
          <div class="font-bold italic">"{example}"</div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
