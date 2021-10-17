<script lang="ts">
  import { page } from "$app/stores";

  import { r } from "$lib/utils/meta-content";
  import wordGenders from "$lib/word-genders";
  import wordTypes from "$lib/word-types";
  import { Grammar, Word } from "@prisma/client";
  import AddDetailButton from "./AddDetailButton.svelte";
  import WordDetail from "./WordDetail.svelte";

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
    {#if !word.wordType}
      <AddDetailButton title="Wortart hinzufügen" page={"wortart-hinzufügen"} />
    {:else if word.wordType === "NOUN" && !grammar.nounPlural}
      <!-- <AddDetailButton title="Plural hinzufügen" page="plural-hinzufügen" /> -->
    {/if}
  </div>
</section>
