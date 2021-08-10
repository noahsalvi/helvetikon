<script>
  import "virtual:windi.css";
  import "$lib/components/WindiComponents.css";
  import Toaster from "$lib/components/Toaster/Toaster.svelte";
</script>

<Toaster />
<slot />

<style global>
  input[type="text"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  svg.fa-icon {
    display: block;
  }
</style>
