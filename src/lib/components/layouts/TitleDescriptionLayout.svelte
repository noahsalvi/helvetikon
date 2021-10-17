<div class="container px-3">
  <h1 class="text-3xl font-bold text-coal"><slot name="title" /></h1>
  <h2 class="text-gray-500 text-lg">
    <slot name="description" />
  </h2>
  <div class="h-10" />
  <slot />
  <div class="h-5" />
</div>
