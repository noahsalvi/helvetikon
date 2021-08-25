<script>
  import Icon from "$lib/components/Icon";
  import { faPen } from "@fortawesome/free-solid-svg-icons";

  export let icon = faPen;
  export let href;
</script>

<a
  class="h-20 w-1/2 max-w-50
  flex flex-col items-center justify-center gap-2
  bg-red-700 shadow-md rounded-lg
  font-semibold"
  {href}
>
  <slot />
  <Icon data={icon} />
</a>
