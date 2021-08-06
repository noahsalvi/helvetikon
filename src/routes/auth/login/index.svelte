<script context="module">
  export function load({ session }) {
    if (session.user) {
      return { status: 302, redirect: "/" };
    }

    return {};
  }
</script>

<script lang="ts">
  import api from "$lib/api";

  import Icon from "$lib/components/Icon";
  import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
  import { maxLength, minLength, required, useForm } from "svelte-use-form";

  let loading = false;

  const form = useForm({
    username: { validators: [required, minLength(4), maxLength(20)] },
    password: { validators: [required, minLength(5), maxLength(20)] },
  });

  const login = () => {
    const data = $form.values;
    api.post("/api/auth/login", data).then((result) => console.log(result));
  };
</script>

<main class="px-3">
  <h1 class="text-2xl font-bold">Willkommen Zurück 👋</h1>
  <div class="text-lg text-gray-500">Schön dich wieder zu sehen.</div>

  <form use:form class="mt-20" on:submit|preventDefault={login}>
    <div class="relative">
      <input
        type="text"
        class="w-full h-14 pl-12 pr-2 bg-light-700 rounded-lg text-xl error:text-primary
        error:siblings:text-primary focus:siblings:text-coal"
        name="username"
        placeholder="Username"
      />
      <Icon
        data={faUser}
        class="text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2"
      />
    </div>

    <div class="h-3" />

    <div class="relative">
      <input
        type="text"
        class="w-full h-14 pl-12 pr-2 bg-light-700 rounded-lg text-xl error:text-primary
        error:siblings:text-primary focus:siblings:text-coal"
        name="password"
        placeholder="Password"
      />
      <Icon
        data={faLock}
        class="text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2"
      />
    </div>
    <div class="mt-3 flex justify-end">
      <a href="/implement">Passwort vergessen?</a>
    </div>
    <div class="h-6" />

    <button
      class="w-full h-14 bg-primary rounded-lg text-white font-semibold text-xl
      {$form.valid ? '' : 'bg-opacity-70'}"
      >Anmelden
    </button>
    <div class="h-6" />
    <div class="flex justify-center items-center">
      <a href="./register"
        >Neu hier? <span class="text-primary text-opacity-70 underline"
          >Registrieren</span
        ></a
      >
    </div>
  </form>
</main>
