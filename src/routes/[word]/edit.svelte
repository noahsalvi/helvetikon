<script context="module">
  export async function load({ page, fetch }) {
    const { word } = page.params;
    const result = await fetch("/api/words/" + word);
    const wordData = await result.json();

    return { props: { word: wordData } };
  }
</script>

<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import type { Word } from ".prisma/client";

  export let word: Word;

  let spellingInput: HTMLInputElement;

  const resizeInput = () =>
    (spellingInput.size = spellingInput.value ? spellingInput.value.length : 1);

  const addSpelling = () => {
    const value = spellingInput.value;
    if (!value) return;
    word.spellings = [...word.spellings, value];
    spellingInput.value = "";
    resizeInput();
  };

  const editExistingSpelling = (e: Event, index: number) => {
    const node = e.target as HTMLInputElement;

    const newSpellings = [...word.spellings];
    newSpellings[index] = node.value;
    word.spellings = newSpellings;
  };

  const deleteExistingSpelling = (e: Event, index: number) => {
    const newSpellings = [...word.spellings];
    newSpellings.splice(index, 1);
    word.spellings = newSpellings;
  };
</script>

<Nav />
<main class="px-3 text-lg">
  <div class="h-5" />
  <h1 class="font-bold text-[38px] text-coal">
    {word.swissGerman}
  </h1>

  <hr class="bg-primary h-1 rounded mb-3" />
  <!-- Schreibweisen -->
  <section>
    <label for="nothing">Schreibweisen</label><br />
    <div class="text-sm text-white flex flex-wrap gap-1">
      {#each word.spellings as spelling, index}
        <input
          on:blur={(e) => deleteExistingSpelling(e, index)}
          on:input={(e) => editExistingSpelling(e, index)}
          class="bg-accent py-1 px-2 rounded-2xl font-mono focus:bg-primary"
          value={spelling}
          size={spelling ? spelling.length : 1}
        />
      {/each}
      <input
        bind:this={spellingInput}
        on:input={resizeInput}
        on:blur={addSpelling}
        class="bg-primary py-1 px-2 rounded-2xl placeholder-white placeholder-shown:text-center"
        placeholder="+"
        size="1"
      />
    </div>
  </section>

  <div class="text-sm">
    Schreibweisen:
    {#each word.spellings as spelling}
      <span>{spelling}</span>
    {/each}
  </div>

  <section class="mt-6 mb-4">
    <h2>Beispiel</h2>
    <div class="font-bold italic">"{word.examples[0]}"</div>
  </section>

  <section class="mb-4">
    <h2>Bedeutung</h2>
    <div class="font-bold">{word.meanings[0]}</div>
  </section>

  <!-- <section class="mb-4">
    <h2>Synonyme</h2>
    <div class="font-bold">{word.meanings[0].value}</div>
  </section> -->
</main>
