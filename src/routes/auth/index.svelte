<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import cookie from "cookie";

  onMount(() => {
    const isNew = !cookie.parse(document.cookie)["not-new"];
    goto(isNew ? "/auth/registrieren" : "/auth/anmelden");
  });
</script>
