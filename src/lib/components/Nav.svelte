<script>
  import config from "../config";
  import {
    faLayerGroup,
    faUserCircle,
  } from "@fortawesome/free-solid-svg-icons";
  import Icon from "./Icon";
  import UserButton from "./UserButton.svelte";
</script>

<!-- Placeholder -->

<nav
  class="bg-white fixed h-15 p-4 w-full flex justify-between items-center shadow-md"
>
  <a href="/" class="flex items-center text-primary">
    <Icon data={faLayerGroup} class="mr-4" scale={1.1} />
    <h1 class="text-lg font-bold">{config.appName}</h1>
  </a>

  <UserButton />
</nav>
<div class="h-15" />
