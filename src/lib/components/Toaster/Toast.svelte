<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { fly } from "svelte/transition";
  import { ToastType } from "./toastProps";

  export let content: string;
  export let type: ToastType;
  export let link: { title: string; href: string } = null;
  export let timeout: number = 2000;

  const dispatch = createEventDispatcher();

  const stylingConfig = {
    [ToastType.Success]: "bg-green-500 text-white",
    [ToastType.Warning]: "bg-light-blue-400 text-white",
    [ToastType.Error]: "bg-red-500 text-white",
  };

  const styling = stylingConfig[type];

  const destroy = () => {
    dispatch("destroy");
  };

  setTimeout(destroy, timeout);
</script>

<div
  on:click={destroy}
  transition:fly
  class="px-4 py-1.5 rounded min-w-30 shadow-md {styling} flex items-center gap-3"
>
  <div>
    {content}
  </div>
  {#if link}
    <div>
      <a class="font-bold text-sm" href={link.href}>{link.title}</a>
    </div>
  {/if}
</div>
