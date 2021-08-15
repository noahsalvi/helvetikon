<script context="module">
  export async function load({ session }) {
    if (!session.user) return { status: 302, redirect: "/" };

    return {};
  }
</script>

<script>
  import { session } from "$app/stores";
  import Button from "$lib/components/Button.svelte";
  import Fab from "$lib/components/Fab.svelte";
  import Gravatar from "$lib/components/Gravatar.svelte";
  import { logout } from "$lib/logout";

  const user = $session.user;
</script>

<main class="bg-primary min-h-screen">
  <div class="h-16" />
  <a
    href="https://de.gravatar.com"
    class="h-30 w-30 block rounded-full overflow-hidden mx-auto"
  >
    <Gravatar />
  </a>

  <div class="h-5" />

  <section class="px-6">
    <div class="text-2xl font-semibold text-center text-white">
      @{user.username}
    </div>
    <div class="h-20" />
    <Button class="text-primary bg-white" on:click={logout}>Abmelden</Button>
  </section>

  <Fab href="/" invert />
</main>
