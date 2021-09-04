<script lang="ts">
  import dialects from "$lib/dialects";
  import type { Word } from ".prisma/client";

  export let recentWords: Word[] = [];
</script>

<section>
  <h2 class="text-xl">Neue Wörter 🥳</h2>
  <div class="h-1" />
  <div class="flex flex-wrap gap-1">
    {#each recentWords as word}
      <a
        class="bg-true-gray-900 text-opacity-50 px-2 py-1  rounded-md"
        href="{dialects[word.dialect].slug}/{word.swissGerman}"
      >
        {word.swissGerman}
      </a>
    {/each}
  </div>
</section>
