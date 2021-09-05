<script context="module">
  export function load({ session }) {
    if (session.user) {
      return { status: 302, redirect: "/" };
    }

    return {};
  }
</script>

<script>
  import LogoWithText from "$lib/components/LogoWithText.svelte";
</script>

<div class="h-screen">
  <header class="px-6 py-5 flex text-xl">
    <LogoWithText logo={false} class="text-primary" />
  </header>

  <div class="h-16" />

  <slot />
</div>

<style global>
</style>
