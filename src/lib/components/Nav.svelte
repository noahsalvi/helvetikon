<script>
  import config from "../../config";
  import { faLayerGroup, faUser } from "@fortawesome/free-solid-svg-icons";
  import Icon from "./Icon";
</script>

<nav
  class="bg-primary h-15 p-4 w-full text-white flex justify-between items-center"
>
  <a href="/" class="flex items-center">
    <Icon data={faLayerGroup} class="mr-4" />
    <h1 class="text-lg font-bold">{config.appName}</h1>
  </a>

  <Icon data={faUser} />
</nav>
