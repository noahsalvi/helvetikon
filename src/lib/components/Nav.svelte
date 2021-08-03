<script>
  import config from "../../config";
  import {
    faLayerGroup,
    faUserCircle,
  } from "@fortawesome/free-solid-svg-icons";
  import Icon from "./Icon";
</script>

<!-- Placeholder -->

<nav
  class="bg-primary fixed h-15 p-4 w-full text-white flex justify-between items-center"
>
  <a href="/" class="flex items-center">
    <Icon data={faLayerGroup} class="mr-4" scale={1.1} />
    <h1 class="text-lg font-bold">{config.appName}</h1>
  </a>

  <Icon data={faUserCircle} scale={1.2} />
</nav>
<div class="h-15" />
