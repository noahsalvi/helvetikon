<script>
  import Button from "./Button.svelte";
  import ReturnButton from "./ReturnButton.svelte";

  export let href = "../";
  export let loading = false;
  export let valid = true;
</script>

<div class="fixed bottom-4 left-0 px-3 w-full flex gap-3">
  <ReturnButton {href} />

  <div class="flex-grow">
    <Button on:click {loading} {valid} class="filter drop-shadow-lg"
      ><slot /></Button
    >
  </div>
</div>
