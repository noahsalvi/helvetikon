<script lang="ts">
  import { session } from "$app/stores";
  import md5 from "md5";

  const email = $session.user?.email || "";
  const gravatarHash: string = md5(email.trim().toLowerCase());
</script>

<img
  src="https://gravatar.com/avatar/{gravatarHash}"
  alt="Gravatar"
  class="h-full w-full"
/>
