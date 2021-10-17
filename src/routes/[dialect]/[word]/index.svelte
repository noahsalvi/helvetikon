<script context="module">
  export async function load({ context }) {
    return { props: context };
  }
</script>

<script lang="ts">
  import { dev } from "$app/env";
  import { page, session } from "$app/stores";
  import Fab from "$lib/components/Fab.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Icon from "$lib/components/Icon";
  import Nav from "$lib/components/Nav.svelte";
  import { error, warn } from "$lib/components/Toaster/toast";
  import config from "$lib/config";
  import dialects from "$lib/dialects";
  import { metaContent } from "$lib/utils/meta-content";
  import {
    faHome,
    faMicrophone,
    faShare,
    faVolumeUp,
  } from "@fortawesome/free-solid-svg-icons";
  import type {
    AudioSample,
    Grammar,
    Interpretation,
    Meaning,
    User,
    Word,
  } from "@prisma/client";
  import ActionButton from "./components/_ActionButton.svelte";
  import Interpretations from "./components/_Interpretations.svelte";
  import WordDetails from "./components/_WordDetails.svelte";

  export let word: Word & {
    createdBy: User;
    audioSamples: AudioSample[];
    grammar: Grammar;
    interpretations: (Interpretation & {
      createdBy: User;
      upvotes: User[];
      downvotes: User[];
      meanings: Meaning[];
    })[];
  };

  const isOwner = $session.user?.id == word.createdByUserId;

  const hasAudioSample = !!word.audioSamples.length;
  let playingAudio = false;

  const share = () => {
    navigator.share({ url: location.toString() });
  };

  const getMetaSpellingList = () => {
    const spellingsList = word.spellings.join(", ");
    return spellingsList && `(${spellingsList}) `;
  };

  const playAudioSample = async () => {
    if (playingAudio) return;
    const path = word.audioSamples[0]?.path;
    if (!path) return error("Konnte Audio nicht abspielen 😲");
    const rootPath = dev
      ? "/audio-samples/"
      : "https://static.helvetikon.org/audio-samples/";
    const audio = new Audio(rootPath + path);
    playingAudio = true;
    await audio.play();
    audio.onended = (_) => {
      playingAudio = false;
    };
    audio.onerror = (err) => {
      playingAudio = false;
      alert(err);
    };
  };

  const addAudioSampleHandler = () => {
    if (!$session.user) warn("Dafür musst du angemeldet sein 👮‍♂️");
  };
</script>

<!-- <SwissCross /> -->

<main class="container min-h-screen flex flex-col">
  {word.grammar.nounGender}
  <Nav />
  <div class="flex-grow">
    <div class="px-3">
      <div
        class="text-sm font-semibold bg-light-200 rounded flex w-min px-2 py-1"
      >
        {dialects[word.dialect].name}
      </div>

      <div class="h-3" />
      <h1 class="font-bold text-5xl text-coal break-words">
        {word.swissGerman}
      </h1>

      <div class="text-lg font-semibold italic">
        {#each word.spellings as spelling, index}
          <span>{spelling}{index < word.spellings.length - 1 ? "," : ""} </span>
        {/each}
      </div>

      <WordDetails {word} />

      <div class="h-4" />

      <!-- Actions -->
      <div class="flex space-x-2 mb-6">
        {#if hasAudioSample}
          <ActionButton on:click={playAudioSample} active={playingAudio}>
            <Icon data={faVolumeUp} />
          </ActionButton>
        {:else}
          <a
            href={$session.user
              ? `${$page.path}/hörbeispiel-hinzufügen`
              : $page.path}
            on:click={addAudioSampleHandler}
            class="h-12 p-3.5 flex justify-between items-center space-x-2
      bg-primary bg-opacity-5 rounded-full"
          >
            <Icon
              data={faMicrophone}
              class="h-full aspect-${1}  flex-shrink-0"
            />
            <div>Hörbeispiel hinzufügen</div>
          </a>
        {/if}
        <ActionButton on:click={share}><Icon data={faShare} /></ActionButton>
      </div>

      <hr class="bg-primary h-1 rounded mb-3" />
    </div>

    <Interpretations interpretations={word.interpretations} />
  </div>
</main>
<Footer />
<Fab icon={faHome} href="/" />

<svelte:head>
  <title>
    {word.swissGerman}&nbsp;{getMetaSpellingList()}- {config.appName}
  </title>

  <meta
    name="description"
    content="{metaContent('Deutsch: ## | ', word.german)}{metaContent(
      '## | ',
      word.interpretations[0]?.meanings[0]?.explanation
    )}{metaContent('Dialekt: ##', dialects[word.dialect].name)}"
  />
</svelte:head>
