<script lang="ts">
  import { page } from "$app/stores";
  import restricted from "$lib/actions/restricted";
  import Icon from "$lib/components/Icon";
  import { r } from "$lib/utils/meta-content";
  import wordGenders from "$lib/word-genders";
  import wordTypes from "$lib/word-types";
  import { faPlus } from "@fortawesome/free-solid-svg-icons";
  import { Grammar, Word } from "@prisma/client";
  import WordDetail from "./_WordDetail.svelte";

  export let word: Word & { grammar: Grammar };
  const grammar = word.grammar;

  const wordTypeValue =
    wordTypes[word.wordType]?.name +
    r(
      `, ${wordGenders[word.grammar.nounGender]?.name}`,
      word.wordType === "NOUN"
    );
</script>

<section class="text-xl">
  {#if word.german}
    <WordDetail
      title="Deutsch:"
      value={word.german}
      href="https://www.duden.de/suchen/dudenonline/{word.german}"
    />
  {/if}
  {#if grammar.nounPlural}
    <WordDetail title="Plural:" value={grammar.nounPlural} />
  {/if}
  {#if word.wordType}
    <WordDetail title="Wortart:" value={wordTypeValue} />
  {:else}
    <a
      href="{$page.path}/wortart-hinzufügen"
      class="border-dashed rounded border-2 text-lg p-0.5 text-gray-400"
      >Wortart hinzufügen</a
    >
  {/if}
  <div class="my-5">
    {#if word.wordType === "NOUN" && !grammar.nounPlural}
      <a
        class="rounded bg-dark-500 text-white text-lg py-1 px-3"
        href="{$page.path}/plural-hinzufügen"
        use:restricted
      >
        <Icon data={faPlus} />
        Plural hinzufügen
      </a>
    {/if}
  </div>
</section>
