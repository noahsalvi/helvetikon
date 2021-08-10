<script lang="ts">
  import Toast from "./Toast.svelte";
  import type { ToastProps } from "./toastProps";
  import toasts from "./toasts";

  const removeToast = (toast: ToastProps) => {
    $toasts = $toasts.filter((t) => t !== toast);
  };
</script>

<section class="fixed w-full z-100">
  <div class="mx-auto mt-4 px-6 flex flex-col items-center gap-2">
    {#each $toasts as toast (toast)}
      <Toast on:destroy={() => removeToast(toast)} {...toast} />
    {/each}
  </div>
</section>
