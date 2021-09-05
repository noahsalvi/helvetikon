<script lang="ts">
  import { session } from "$app/stores";
  import md5 from "md5";

  const email = $session.user?.email || "";
  const gravatarHash: string = md5(email.trim().toLowerCase());
</script>

<img
  src="https://gravatar.com/avatar/{gravatarHash}"
  alt="Gravatar"
  width="50"
  height="50"
  class="h-full w-full"
/>
