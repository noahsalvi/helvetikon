<script>
  import "virtual:windi.css";
  import Windi from "$lib/components/Windi.svelte";
</script>

<Windi />
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
