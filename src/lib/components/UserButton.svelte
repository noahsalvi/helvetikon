<script lang="ts">
  import { session } from "$app/stores";
  import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
  import md5 from "md5";
  import Icon from "svelte-awesome/components/Icon.svelte";

  const email = "noahsalvi@me.com";
  const gravatarHash: string = md5(email.trim().toLowerCase());

  $: authenticated = !!$session.user;
</script>

<div class="h-9 w-9">
  {#if authenticated}
    <a
      href="/profile/{$session.user.username}"
      class="block h-full w-full rounded-full bg-white border-2 overflow-hidden relative"
    >
      <img
        src="https://gravatar.com/avatar/{gravatarHash}"
        alt="Gravatar"
        class="absolute left-0 top-0"
      />
    </a>
  {:else}
    <a href="/auth/login" class="h-full w-full">
      <Icon data={faUserCircle} class="!block h-full w-full" />
    </a>
  {/if}
</div>
