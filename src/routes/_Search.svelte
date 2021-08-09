<script lang="ts">
  import { goto } from "$app/navigation";

  import Icon from "$lib/components/Icon";

  import type { Word } from ".prisma/client";
  import { faSearch } from "@fortawesome/free-solid-svg-icons";

  let searchResultWords: Word[] = [];

  let timer;
  let query = "";
  let loading = false;

  const debounce = (callback: Function, timeout: number) => {
    clearTimeout(timer);
    timer = setTimeout(callback, timeout);
  };

  const search = () => {
    if (query.length < 1) {
      searchResultWords = [];
      return;
    }
    loading = true;
    const path = `/api/words/search/${query}`;
    debounce(() => {
      fetch(path).then((result) =>
        result.json().then((words) => {
          loading = false;
          if (query.length < 1) return;
          searchResultWords = words;
        })
      );
    }, 200);
  };

  const handleEnter = (e) => {
    if (e.key !== "Enter") return;
    const firstSearchResult = searchResultWords[0];
    if (firstSearchResult) {
      const path = `/worte/${firstSearchResult.swissGerman}`;
      goto(path);
    }
  };
</script>

<div class="relative">
  <label for="search">Wortsuche</label>
  <div class="mt-2 relative">
    <input
      bind:value={query}
      on:input={search}
      on:keypress={handleEnter}
      class="w-full rounded-xl p-3 pr-12 font-bold h-14 text-black border !border-3 !border-light-900 placeholder-gray-500"
      type="text"
      placeholder="Zwetschgää.."
    />

    <Icon
      class="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500"
      data={faSearch}
    />
  </div>

  <div class="h-3" />

  <div class="absolute w-full bg-white text-black rounded-lg shadow-lg">
    {#each searchResultWords as word}
      <a
        href="/worte/{word.swissGerman}"
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
