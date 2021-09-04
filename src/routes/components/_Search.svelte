<script lang="ts">
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";

  import Icon from "$lib/components/Icon";
  import dialects from "$lib/dialects";
  import { r } from "$lib/utils/meta-content";

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
        result.json().then((words: Word[]) => {
          loading = false;
          if (query.length < 1) return;
          const dialectKeys = Object.keys(dialects);

          // Sort after the dialects object and preferredDialect
          const sortedWords = words.sort((a, b) => {
            if (a.dialect === $session.user.preferredDialect) return -1;
            const aPos = dialectKeys.indexOf(a.dialect);
            const bPos = dialectKeys.indexOf(b.dialect);
            return aPos - bPos;
          });

          searchResultWords = sortedWords;
        })
      );
    }, 200);
  };

  const gotoFirstSearchResult = () => {
    const firstSearchResult = searchResultWords[0];
    if (firstSearchResult) {
      const path = `/${dialects[firstSearchResult.dialect].slug}/${
        firstSearchResult.swissGerman
      }`;
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
      on:keypress={(e) => e.key === "Enter" && gotoFirstSearchResult()}
      class="w-full rounded-xl p-3 pr-12 font-bold h-14 text-black border !border-3 !border-light-900 placeholder-gray-500"
      type="text"
      placeholder="Zwetschgää.."
    />
    <button
      disabled={!searchResultWords.length}
      on:click={gotoFirstSearchResult}
      class="p-1 absolute right-3 top-1/2 transform -translate-y-1/2 disabled:cursor-default"
    >
      <Icon class="text-gray-500" data={faSearch} />
    </button>
  </div>

  <div class="h-3" />

  <div
    class="absolute w-full bg-white text-sm text-black rounded-lg shadow-lg overflow-hidden"
  >
    {#each searchResultWords as word}
      <a
        href="/{dialects[word.dialect].slug}/{word.swissGerman}"
        class="flex items-center flex-wrap px-3 py-2 border-light-700 not-last:border-b-2 
        {r(
          'bg-hint bg-opacity-40',
          word.dialect === $session.user.preferredDialect
        )}"
      >
        <div class="bg-accent text-sm text-white p-1 mr-3 rounded-md">
          {word.swissGerman}
        </div>
        <div>
          {word.german}
        </div>
        <div class="ml-auto text-1/2 flex-grow-0 overflow-ellipsis">
          {dialects[word.dialect].name}
        </div>
      </a>
    {:else}
      {#if !loading && query.length > 2}
        <div class="px-3 py-2 m-1">🥵 Nüd gfungä</div>
      {/if}
    {/each}
  </div>
</div>
