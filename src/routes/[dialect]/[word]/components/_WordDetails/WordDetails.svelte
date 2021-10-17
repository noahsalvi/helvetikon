<script lang="ts">
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
  {/if}

  {#if !word.wordType}
    <div class="h-3" />
    <AddDetailButton title="Wortart hinzufügen" path="wortart-hinzufügen" />
  {:else}
    <div class="mt-3">
      {#if word.wordType === "NOUN" && !grammar.nounPlural}
        <AddDetailButton title="Plural hinzufügen" path="plural-hinzufügen" />
      {:else if word.wordType === "VERB"}
        <!-- Todo -->
      {:else if word.wordType === "ADJECTIVE"}
        <!-- Todo -->
      {/if}
    </div>
  {/if}
</section>
