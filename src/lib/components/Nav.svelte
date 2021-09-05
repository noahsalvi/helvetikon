<script>
  import config from "../config";
  import {
    faLayerGroup,
    faUserCircle,
  } from "@fortawesome/free-solid-svg-icons";
  import Icon from "./Icon";
  import UserButton from "./UserButton.svelte";
  import LogoWithText from "./LogoWithText.svelte";
</script>

<!-- Placeholder -->

<nav
  class="bg-white fixed h-15 px-6 w-full flex justify-between items-center shadow-md"
>
  <LogoWithText class="text-primary transform scale-70 origin-left" />

  <UserButton />
</nav>
<div class="h-15" />
