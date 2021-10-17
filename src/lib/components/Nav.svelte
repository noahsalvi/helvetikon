<script>
  import LogoWithText from "./LogoWithText.svelte";
  import UserButton from "./UserButton.svelte";

  export let spacingBottom = true;
</script>

<!-- Placeholder -->

<nav class="z-50 bg-white fixed left-0 h-15 px-6 w-full shadow-md">
  <div class="container h-full flex justify-between items-center">
    <LogoWithText class="text-primary transform scale-70 origin-left" />

    <UserButton />
  </div>
</nav>
<div class="h-15" />
{#if spacingBottom}
  <div class="h-5" />
{/if}
