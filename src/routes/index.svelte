<script context="module">
  export async function load({ fetch }) {
    const fetchRecentWords = fetch("/api/words/recent");
    const fetchPopularWords = fetch("api/words/popular");
    const [recentWordsResponse, popularWordsResponse] = await Promise.all([
      fetchRecentWords,
      fetchPopularWords,
    ]);

    if (!recentWordsResponse.ok || !popularWordsResponse.ok) return;

    const recentWords = await recentWordsResponse.json();
    const popularWords = await popularWordsResponse.json();

    return { props: { recentWords, popularWords } };
  }
</script>

<script>
  import { session } from "$app/stores";

  import UserButton from "$lib/components/UserButton.svelte";
  import {
    faBook,
    faLayerGroup,
    faPlus,
  } from "@fortawesome/free-solid-svg-icons";
  import config from "../lib/config";
  import LandingAction from "./components/_LandingAction.svelte";
  import Search from "./components/_Search.svelte";
  import PopularWords from "./components/_PopularWords.svelte";
  import NewWords from "./components/_NewWords.svelte";
  import { logout } from "$lib/logout";
  import LogoWithText from "$lib/components/LogoWithText.svelte";

  export let recentWords;
  export let popularWords;
</script>

<main class="bg-primary min-h-screen px-6 text-white">
  <header class="pb-5 max-w-screen-md mx-auto">
    <div class="flex justify-between items-center h-15 dark">
      {#if $session.user}
        <button on:click={logout}>Abmelden</button>
      {:else}
        <div />
      {/if}
      <UserButton />
    </div>

    <div class="h-10" />

    <LogoWithText />
  </header>

  <div class="max-w-screen-md mx-auto">
    <Search />

    <div class="h-2" />

    <div class="flex gap-5">
      <LandingAction icon={faBook} href="/worte">Alle Wörter</LandingAction>
      {#if $session.user}
        <LandingAction icon={faPlus} href="/wort-hinzufügen">
          Wort hinzufügen
        </LandingAction>
      {/if}
    </div>

    <div class="h-15" />

    <NewWords {recentWords} />

    <div class="h-5" />

    <PopularWords {popularWords} />

    <div class="h-3" />
  </div>
</main>

<svelte:head>
  <title>{config.appName} | Schweizerdeutsches Wörterbuch 📔</title>
  <meta
    name="description"
    content="Ein Oline-Wörterbuch für die schweizerdeutsche Sprache, das von jedem verbessert werden kann."
  />
</svelte:head>
