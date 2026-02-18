<script lang="ts">
  import Icon from "$lib/components/Icon";
  import { faStar } from "@fortawesome/free-solid-svg-icons";

  export let name;
  export let description = "";
  export let preferred = false;
</script>

<li class="h-12">
  {#if description}
    <button
      type="button"
      on:click
      class="h-full w-full 
    flex flex-col justify-center items-start
    pl-3 rounded-lg
    {preferred ? 'bg-light-700' : 'bg-light-400'}"
    >
      <div class="font-semibold leading-none">
        {name}
      </div>
      <div class="text-[0.7rem] text-gray-500">
        {description}
      </div>
    </button>
  {:else}
    <button
      type="button"
      on:click
      class="h-full w-full 
      px-3 rounded-lg
      {preferred ? 'bg-light-700' : 'bg-light-400'}"
    >
      <div class="text-left font-semibold leading-none flex justify-between">
        {name}
        {#if preferred}
          <Icon data={faStar} />
        {/if}
      </div>
    </button>
  {/if}
</li>
