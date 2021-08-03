<script>
  import Icon from "$lib/components/Icon";
  import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
  import config from "../config";
  import Search from "./_Search.svelte";
</script>

<main class="bg-primary h-screen px-3 text-white">
  <header class="py-10">
    <div class="flex justify-center items-center">
      <Icon data={faLayerGroup} scale={2} class="mr-3" />
      <h1 class="text-3xl">{config.appName}</h1>
    </div>
  </header>
  <Search />
</main>
