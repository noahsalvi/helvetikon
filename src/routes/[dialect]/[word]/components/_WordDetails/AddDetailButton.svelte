<script>
  import restricted from "$lib/actions/restricted";
  import Icon from "$lib/components/Icon";
  import { faPlus } from "@fortawesome/free-solid-svg-icons";

  export let title;
  export let page;
</script>

<a
  class="rounded bg-dark-500 text-white text-lg py-1 px-3"
  href="{$page.path}/{page}"
  use:restricted
>
  <Icon data={faPlus} />
  {title}
</a>
