<script>
  import api from "$lib/api";

  import Icon from "$lib/components/Icon";
  import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
  import config from "../config";
  import Search from "./_Search.svelte";

  const logout = () => {
    api.post("/api/auth/logout");
  };
</script>

<main class="bg-primary h-screen px-3 text-white">
  <header class="py-10">
    <div class="flex justify-center items-center">
      <Icon data={faLayerGroup} scale={2} class="mr-3" />
      <h1 class="text-3xl">{config.appName}</h1>
    </div>
  </header>
  <Search />

  <button on:click={logout}>Log out</button>
</main>
