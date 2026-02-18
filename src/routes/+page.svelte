<script>
  import { page } from "$app/stores";

  import UserButton from "$lib/components/UserButton.svelte";
  import { faBook, faPlus } from "@fortawesome/free-solid-svg-icons";
  import config from "../lib/config";
  import LandingAction from "./components/_LandingAction.svelte";
  import Search from "./components/_Search.svelte";
  import PopularWords from "./components/_PopularWords.svelte";
  import NewWords from "./components/_NewWords.svelte";
  import { logout } from "$lib/logout";
  import LogoWithText from "$lib/components/LogoWithText.svelte";
  import Footer from "$lib/components/Footer.svelte";

  export let data;
  const recentWords = data.recentWords;
  const popularWords = data.popularWords;
</script>

<main class="bg-primary min-h-screen px-6 text-white">
  <header class="pb-5 max-w-screen-md mx-auto">
    <div class="flex justify-between items-center h-15 dark">
      {#if $page.data.user}
        <button on:click={logout}>Abmelden</button>
      {:else}
        <div></div>
      {/if}
      <UserButton />
    </div>

    <div class="h-10"></div>

    <LogoWithText />
  </header>

  <div class="max-w-screen-md mx-auto">
    <Search />

    <div class="h-2"></div>

    <div class="flex gap-5">
      <LandingAction icon={faBook} href="/worte">Alle Wörter</LandingAction>
      {#if $page.data.user}
        <LandingAction icon={faPlus} href="/wort-hinzufügen">
          Wort hinzufügen
        </LandingAction>
      {/if}
    </div>

    <div class="h-15"></div>

    <NewWords {recentWords} />

    <div class="h-5"></div>

    <PopularWords {popularWords} />

    <div class="h-10"></div>
  </div>
</main>
<Footer />

<svelte:head>
  <title>{config.appName} | Schweizerdeutsches Wörterbuch</title>
  <meta
    name="description"
    content="Ein Oline-Wörterbuch für die schweizerdeutsche Sprache, das von jedem verbessert werden kann."
  />
</svelte:head>
