<script lang="ts">
  import type { Word } from ".prisma/client";

  let searchResultWords: Word[] = [];

  let timer;
  let query = "";
  let loading = false;

  const debounce = (callback: Function, timeout: number) => {
    clearTimeout(timer);
    timer = setTimeout(callback, timeout);
  };

  const search = () => {
    if (query.length < 2) {
      searchResultWords = [];
      return;
    }
    loading = true;
    const path = `/api/words/search/${query}`;
    debounce(() => {
      fetch(path).then((result) =>
        result.json().then((words) => {
          searchResultWords = words;
          loading = false;
        })
      );
    }, 200);
  };
</script>

<div class="relative">
  <label for="search">Wortsuche</label>
  <input
    bind:value={query}
    on:input={search}
    class="w-full rounded-xl p-3 font-bold mt-2 h-14 text-black border !border-3 !border-light-900 placeholder-gray-500"
    type="text"
    placeholder="Zwetschgää.."
  />

  <div class="h-3" />

  <div class="absolute w-full bg-white text-black rounded-lg shadow-lg">
    {#each searchResultWords as word}
      <a
        href="/{word.swissGerman}"
        class="flex items-center px-3 py-2 border-light-700 not-last:border-b-2"
      >
        <div class="bg-accent text-white p-1 mr-3 rounded-md">
          {word.swissGerman}
        </div>
        <div>
          {word.german}
        </div>
      </a>
    {:else}
      {#if !loading && query.length > 2}
        <div class="px-3 py-2 m-1">🥵 Nüd gfungä</div>
      {/if}
    {/each}
  </div>
</div>
