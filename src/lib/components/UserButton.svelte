<script lang="ts">
  import { session } from "$app/stores";
  import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
  import md5 from "md5";
  import Icon from "svelte-awesome/components/Icon.svelte";

  const email = $session.user?.email || "";
  const gravatarHash: string = md5(email.trim().toLowerCase());

  $: authenticated = !!$session.user;
</script>

<div class="h-9 w-9">
  {#if authenticated}
    <a
      href="/profile/{$session.user.username}"
      class="block h-full w-full rounded-full border-2 border-light-900 bg-light-900 overflow-hidden dark:(border-white bg-white)"
    >
      <img
        src="https://gravatar.com/avatar/{gravatarHash}"
        alt="Gravatar"
        class="h-full w-full"
      />
    </a>
  {:else}
    <a href="/auth/login" class="h-full w-full">
      <Icon
        data={faUserCircle}
        class="!block h-full w-full text-light-900 dark:text-white"
      />
    </a>
  {/if}
</div>
