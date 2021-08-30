<script>
  import Icon from "$lib/components/Icon";
  import { faInbox } from "@fortawesome/free-solid-svg-icons";
</script>

<main class="px-6">
  <h1 class="text-2xl font-bold">E-Mail Verifizieren 🔎</h1>
  <div class="text-lg text-gray-500">
    Um deine Registrierung abzuschliessen, musst du noch deine E-Mail-Adresse
    verifizieren. Prüfe deinen Posteingang
  </div>
  <div class="h-10" />
  <div class="text-primaryDark font-bold text-center" />
  <div class="h-5" />
  <div
    class="bg-light-200 h-50 w-50 mx-auto rounded-full flex justify-center items-center p-10"
  >
    <Icon data={faInbox} class="h-full w-full text-light-800" />
  </div>
  <div class="h-20" />
  <div class="text-center">
    <a href="anmelden" class="underline text-primary text-sm"
      >Zurück zum Login</a
    >
  </div>
</main>

<svelte:head>
  <title>E-Mail verifizieren</title>
</svelte:head>
