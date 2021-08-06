<script>
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
  import Icon from "svelte-awesome/components/Icon.svelte";

  export let href = "./";
</script>

<a
  {href}
  class="bg-primary h-14 w-14 rounded-full p-4 text-white filter drop-shadow-lg"
>
  <Icon data={faArrowLeft} class="!block h-full w-full" />
</a>
