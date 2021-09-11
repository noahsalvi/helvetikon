<script>
  import { r } from "$lib/utils/meta-content";

  export let active = false;
</script>

<button
  disabled={active}
  on:click
  class="h-12 w-12 p-3.5 flex justify-center items-center 
  bg-primary bg-opacity-5 rounded-full
  svg:(w-full h-full)
  {r('bg-opacity-100 svg:text-white', active)}
  not-disabled:active:(bg-opacity-50)"
>
  <slot />
</button>
