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
  import api from "$lib/api";
  import Icon from "$lib/components/Icon";
  import { warnNextVisit } from "$lib/components/Toaster/toast";
  import UserButton from "$lib/components/UserButton.svelte";
  import {
    faBook,
    faLayerGroup,
    faPlus,
  } from "@fortawesome/free-solid-svg-icons";
  import config from "../lib/config";
  import LandingAction from "./_LandingAction.svelte";
  import Search from "./_Search.svelte";
  import PopularWords from "./_PopularWords.svelte";
  import NewWords from "./_NewWords.svelte";

  export let recentWords;
  export let popularWords;

  const logout = () => {
    api.post("/api/auth/logout").then(() => {
      warnNextVisit("Du hast dich abgemeldet 🏃‍♂️");
      location.reload();
    });
  };
</script>

<main class="bg-primary min-h-screen px-6 text-white">
  <header class="pb-5">
    <div class="flex justify-between items-center h-15 dark">
      {#if $session.user}
        <button on:click={logout}>Log out</button>
      {:else}
        <div />
      {/if}
      <UserButton />
    </div>

    <div class="h-10" />

    <div class="flex justify-center items-center">
      <Icon data={faLayerGroup} scale={2} class="mr-3" />
      <h1 class="text-3xl">{config.appName}</h1>
    </div>
  </header>

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
</main>

<svelte:head>
  <title>{config.appName} | Schweizerdeutsches Wörterbuch 📔</title>
  <meta
    name="description"
    content="Ein Oline-Wörterbuch für die schweizerdeutsche Sprache, das von jedem verbessert werden kann."
  />
</svelte:head>
