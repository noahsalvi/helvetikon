<script lang="ts">
  import Icon from "$lib/components/Icon";
  import type { Word } from ".prisma/client";
  import { faAward } from "@fortawesome/free-solid-svg-icons";
  type PopularWord = Word & {
    popularity: number;
  };

  export let popularWords: PopularWord[] = [];
</script>

<section class="rounded-lg overflow-hidden">
  <div class="bg-red-800 px-3 py-2 flex items-center gap-3">
    <Icon data={faAward} class="" />
    <span class="text-xl">Populäre Wörter</span>
  </div>
  {#each popularWords as word, index}
    <a
      href="/worte/{word.swissGerman}"
      class="bg-red-700 px-3 py-3 flex items-center gap-3"
    >
      <div
        class="bg-white text-primary h-5 w-5 rounded-full flex items-center justify-center"
      >
        {index + 1}
      </div>
      <div>
        {word.swissGerman}
      </div>
      <div class="ml-auto">{word.popularity}</div>
    </a>
  {/each}
</section>
