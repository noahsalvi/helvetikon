<script lang="ts">
  import Icon from "$lib/components/Icon";
  import { faTrash } from "@fortawesome/free-solid-svg-icons";
  import { tick } from "svelte";

  export let examples: string[];

  const deleteExample = (index: number) => {
    const newExamples = [...examples];
    newExamples.splice(index, 1);
    examples = newExamples;
  };

  const addExample = async () => {
    const newExamples = [...examples];
    newExamples.push("");
    examples = newExamples;

    await tick();

    const input: HTMLInputElement = document.querySelector(
      "#example-" + (examples.length - 1)
    );
    input.focus();
  };
</script>

<section>
  <label for="example">Beispielsätze</label>
  <div class="flex flex-col gap-2">
    {#each examples as example, index}
      <div class="flex">
        <input
          bind:value={example}
          class="w-full bg-light-300 rounded px-2 py-1"
          type="text"
          id="example-{index}"
          placeholder="Schweizerdeutsch"
        />

        <button on:click={() => deleteExample(index)} class="px-3">
          <Icon data={faTrash} scale={1.2} />
        </button>
      </div>
    {/each}
  </div>

  <div class="h-1" />

  <button on:click={addExample} class="text-primary font-bold text-sm"
    >+ Beispiel hinzufügen</button
  >
</section>
