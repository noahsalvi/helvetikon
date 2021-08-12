<script lang="ts">
  export let spellings: string[];

  let spellingInput: HTMLInputElement;

  const resizeInput = () =>
    (spellingInput.size = spellingInput.value ? spellingInput.value.length : 1);

  const addSpelling = () => {
    const value = spellingInput.value;
    if (!value) return;
    spellings = [...spellings, value];
    spellingInput.value = "";
    resizeInput();
  };

  const editExistingSpelling = (e: Event, index: number) => {
    const node = e.target as HTMLInputElement;

    const newSpellings = [...spellings];
    newSpellings[index] = node.value;
    spellings = newSpellings;
  };

  const deleteExistingSpelling = (e: Event, index: number) => {
    if (spellings[index]) return;
    const newSpellings = [...spellings];
    newSpellings.splice(index, 1);
    spellings = newSpellings;
  };
</script>

<section class="mb-3">
  <label for="nothing">Alternative Schreibweisen</label><br />
  <div class="text-sm text-white flex flex-wrap gap-1">
    {#each spellings as spelling, index}
      <input
        on:blur={(e) => deleteExistingSpelling(e, index)}
        on:input={(e) => editExistingSpelling(e, index)}
        on:keypress={({ key }) => key === "Enter" && spellingInput.focus()}
        class="bg-gray-800 text-white py-1 px-2 rounded-lg font-mono focus:bg-black"
        value={spelling}
        size={spelling ? spelling.length : 1}
      />
    {/each}
    <input
      bind:this={spellingInput}
      on:input={resizeInput}
      on:blur={addSpelling}
      on:keypress={({ key }) => key === "Enter" && addSpelling()}
      class="bg-gray-800 py-1 px-2 rounded-lg placeholder-white placeholder-shown:(text-center focus:placeholder-transparent)"
      placeholder="+"
      size="1"
    />
  </div>
</section>
