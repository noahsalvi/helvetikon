<script>
  import { onMount } from "svelte";
  import Logo from "./Logo.svelte";

  let email = "";

  onMount(() => {
    // Set the email via javascript to prevent it from being scraped by crawlers
    const user = "helvetikon";
    const domain = "noahsalvi.ch";
    const symbol = "@";
    email = user + symbol + domain;
  });
</script>

<footer class="bg-black text-white px-6">
  <div class="container py-10">
    <div class="w-12 mx-auto bg-primaryDark p-2 rounded">
      <Logo class />
    </div>

    <div class="h-3" />

    <div class="text-center text-gray-300 text-sm">Kontaktiere mich unter:</div>
    <div class="text-center text-xl">
      <a href="mailto:{email || 'stop-collecting@emails.org'}">
        {email || "Aktivere javascript"}
      </a>
    </div>

    <div class="h-3" />

    <div class="flex items-center justify-center">
      <a href="https://github.com/noahsalvi/helvetikon">Github</a>
      <div class="h-1 w-1 mx-3 rounded-full bg-gray-300" />
      <a href="/faq">FAQ</a>
    </div>
  </div>
</footer>
