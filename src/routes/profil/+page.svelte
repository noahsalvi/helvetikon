<script>
  import { page } from "$app/stores";
  import Button from "$lib/components/Button.svelte";
  import Fab from "$lib/components/Fab.svelte";
  import Gravatar from "$lib/components/Gravatar.svelte";
  import { logout } from "$lib/logout";

  const user = $page.data.user;
</script>

<main class="bg-primary min-h-screen">
  <div class="container relative">
    <div class="h-16"></div>
    <a
      href="https://de.gravatar.com"
      class="h-30 w-30 block rounded-full overflow-hidden mx-auto"
    >
      <Gravatar />
    </a>

    <div class="h-5"></div>

    <section class="px-6">
      <div class="text-2xl font-semibold text-center text-white">
        @{user.username}
      </div>
      <div class="h-20"></div>
      <Button class="text-primary bg-white" on:click={logout}>Abmelden</Button>
    </section>

    <Fab href="/" invert />
  </div>
</main>
