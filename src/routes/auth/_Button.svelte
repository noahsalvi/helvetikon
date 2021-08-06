<script>
  import Icon from "$lib/components/Icon";
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";

  export let loading;
  export let form;
</script>

<button
  disabled={!$form.valid || loading}
  class="w-full h-14 bg-primary rounded-lg text-white font-semibold text-xl disabled:bg-opacity-70"
>
  <slot />
</button>
