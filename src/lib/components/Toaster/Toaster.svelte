<script lang="ts">
  import { onMount } from "svelte";

  import Toast from "./Toast.svelte";
  import type { ToastProps } from "./toastProps";
  import toasts from "./toasts";

  const removeToast = (toast: ToastProps) => {
    $toasts = $toasts.filter((t) => t !== toast);
  };

  onMount(() => {
    const toast = JSON.parse(sessionStorage.getItem("toast-next-visit"));
    sessionStorage.removeItem("toast-next-visit");
    if (toast) $toasts = [toast, ...$toasts];
  });
</script>

<section class="fixed w-full z-100">
  <div class="mx-auto mt-4 px-6 flex flex-col items-center gap-2">
    {#each $toasts as toast (toast)}
      <Toast on:destroy={() => removeToast(toast)} {...toast} />
    {/each}
  </div>
</section>
