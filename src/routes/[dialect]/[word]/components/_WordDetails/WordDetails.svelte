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

  {#if word.wordType}
    {#if word.wordType === "NOUN"}
      {#if grammar.nounPlural}
        <WordDetail title="Plural:" value={grammar.nounPlural} />
      {/if}
    {:else if word.wordType === "ADJECTIVE"}
      {#if grammar.adjectiveComparative}
        <WordDetail title="Komparativ:" value={grammar.adjectiveComparative} />
      {/if}
      {#if grammar.adjectiveSuperlative}
        <WordDetail title="Superlativ:" value={grammar.adjectiveSuperlative} />
      {/if}
    {:else if word.wordType === "VERB"}
      {#if grammar.verbParticiplePast}
        <WordDetail title="Partizip II:" value={grammar.verbParticiplePast} />
      {/if}
    {/if}

    <WordDetail title="Wortart:" value={wordTypeValue} />
  {/if}

  {#if !word.wordType}
    <div class="h-3" />
    <AddDetailButton title="Wortart hinzufügen" path="wortart-hinzufügen" />
    <div class="h-3" />
  {:else}
    <div class="my-3 flex gap-2 flex-wrap">
      {#if word.wordType === "NOUN" && !grammar.nounPlural}
        <AddDetailButton title="Plural hinzufügen" path="plural-hinzufügen" />
      {:else if word.wordType === "VERB"}
        <!-- Todo -->
        {#if !grammar.verbParticiplePast}
          <AddDetailButton title="Partizip II" path="partizip-2" />
        {/if}
      {:else if word.wordType === "ADJECTIVE"}
        {#if !grammar.adjectiveComparative}
          <AddDetailButton
            title="Komparativ"
            path="adjektiv-steigerung-hinzufügen"
          />
        {/if}
        {#if !grammar.adjectiveSuperlative}
          <AddDetailButton
            title="Superlativ"
            path="adjektiv-steigerung-hinzufügen"
          />
        {/if}
        <!-- Todo -->
      {/if}
    </div>
  {/if}
</section>
