<script lang="ts">
  import { session } from "$app/stores";
  import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
  import Icon from "svelte-awesome/components/Icon.svelte";
  import Gravatar from "./Gravatar.svelte";
  import cookie from "cookie";
  import { onMount } from "svelte";

  let isNew: boolean;

  $: authenticated = !!$session.user;
  $: authPath = "/auth/" + (isNew ? "registrieren" : "anmelden");

  onMount(() => {
    isNew = !cookie.parse(document.cookie)["not-new"];
  });
</script>

<div class="h-9 w-9">
  {#if authenticated}
    <a
      href="/profil"
      class="block h-full w-full rounded-full border-2 border-light-900 bg-light-900 overflow-hidden dark:(border-white bg-white)"
    >
      <Gravatar />
    </a>
  {:else}
    <a href={authPath} class="h-full w-full">
      <Icon
        data={faUserCircle}
        class="!block h-full w-full text-light-900 dark:text-white"
      />
    </a>
  {/if}
</div>
