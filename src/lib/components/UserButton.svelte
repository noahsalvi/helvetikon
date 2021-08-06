<script lang="ts">
  import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

  import md5 from "md5";
  import Icon from "svelte-awesome/components/Icon.svelte";

  const email = "noahsalvi@me.com";
  const gravatarHash: string = md5(email.trim().toLowerCase());

  let authenticated = false;
</script>

{#if authenticated}
  <a href="/profile/username" class="h-full">
    <img
      src="https://gravatar.com/avatar/{gravatarHash}"
      alt="Gravatar"
      class="h-full rounded-full"
    />
  </a>
{:else}
  <a href="/auth/login" class="h-full">
    <Icon data={faUserCircle} class="!block h-full w-full" />
  </a>
{/if}
