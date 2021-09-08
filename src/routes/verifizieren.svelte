<script context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import { page } from "$app/stores";
  import api from "$lib/api";
  import {
    successNextVisit,
    warnNextVisit,
  } from "$lib/components/Toaster/toast";
  import { onMount } from "svelte";
  const token = $page.query.get("token");

  onMount(async () => {
    api
      .get("/api/auth/verify?token=" + token)
      .then(() => {
        successNextVisit("Du bist nun registriert 🎉");
        location.replace("/");
      })
      .catch((reason: Response) => {
        switch (reason.status) {
          case 409: {
            warnNextVisit("Du bist bereits verifiziert");
            break;
          }
          case 400:
          case 500: {
            warnNextVisit("Etwas ist beim verifizieren schief gelaufen", 4000);
            break;
          }
        }

        location.replace("/");
      });
  });
</script>

<main class="h-screen bg-primary" />
