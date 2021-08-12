<script>
  export let title;
  export let description = "";
</script>

<section class="step-layout px-6">
  <h1>{@html title}</h1>
  <h2>{description}</h2>
  <form action="" />
  <div class="h-10" />
  <slot />
  <div class="h-5" />
</section>

<style global>
  .svelte-use-form-hint {
    @apply text-red-500 mt-1;
  }

  .step-layout h1 {
    @apply text-3xl font-bold text-coal;
  }

  .step-layout h2 {
    @apply text-gray-500 text-lg;
  }
</style>
