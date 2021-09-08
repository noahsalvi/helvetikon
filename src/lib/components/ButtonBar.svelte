<script>
  import Button from "./Button.svelte";
  import ReturnButton from "./ReturnButton.svelte";

  export let href = ".";
  export let loading = false;
  export let valid = true;
</script>

<div class="fixed bottom-6 left-0 px-6 w-full ">
  <div class="flex gap-3 container">
    <ReturnButton {href} />

    <div class="flex-grow">
      <Button on:click {loading} {valid} class="filter drop-shadow-lg"
        ><slot /></Button
      >
    </div>
  </div>
</div>
