<script>
  import Icon from "$lib/components/Icon";

  export let value = "";
  export let icon;
  export let name;
  export let placeholder;
  export let type = "text";
  export let disabled = false;
  export let readonly = false;
</script>

<div class="relative">
  <input
    class="w-full h-14 pl-12 pr-2 bg-light-700 rounded-lg text-xl error:text-primary
      error:siblings:text-primary focus:siblings:text-coal
      disabled:cursor-not-allowed"
    {value}
    {name}
    {placeholder}
    {type}
    {disabled}
    {readonly}
    autocomplete={name}
  />
  <Icon
    data={icon}
    class="text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2"
  />
</div>
