<script>
  import { page } from "$app/stores";

  import restricted from "$lib/actions/restricted";
  import Icon from "$lib/components/Icon";
  import { faPlus } from "@fortawesome/free-solid-svg-icons";

  export let title;
  export let path;
</script>

<a
  class="rounded flex bg-dark-500 text-white text-lg w-max py-1 px-3 gap-1 items-center"
  href="{$page.path}/{path}"
  use:restricted
>
  <Icon data={faPlus} />
  {title}
</a>
