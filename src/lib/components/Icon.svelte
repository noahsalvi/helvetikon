<script lang="ts">
  export let data;
  export let spin = false;
  export let scale = 1;
  export let className = "";
  export { className as class };

  $: iconTuple = data?.icon || [16, 16, [], "", ""];
  $: width = iconTuple[0] || 16;
  $: height = iconTuple[1] || 16;
  $: pathData = iconTuple[4] || "";
  $: paths = Array.isArray(pathData) ? pathData : [pathData];
</script>

<svg
  aria-hidden="true"
  role="img"
  viewBox={`0 0 ${width} ${height}`}
  class={`fa-icon ${className} ${spin ? "fa-spin" : ""}`}
  style={`transform: scale(${scale}); transform-origin: center;`}
>
  {#each paths as path}
    <path d={path}></path>
  {/each}
</svg>

<style>
  .fa-spin {
    animation: fa-spin 1s infinite linear;
  }

  @keyframes fa-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
