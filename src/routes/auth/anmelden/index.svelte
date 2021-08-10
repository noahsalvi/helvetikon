<script lang="ts">
  import api from "$lib/api";
  import { error, successNextVisit } from "$lib/components/Toaster/toast";

  import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
  import { maxLength, minLength, required, useForm } from "svelte-use-form";
  import Button from "../../../lib/components/Button.svelte";
  import TextFieldWithIcon from "../_TextFieldWithIcon.svelte";

  let loading = false;

  const form = useForm({
    username: { validators: [required, minLength(4), maxLength(20)] },
    password: { validators: [required, minLength(5), maxLength(20)] },
  });

  const login = () => {
    loading = true;
    const data = $form.values;
    api
      .post("/api/auth/login", data)
      .then((_) => {
        successNextVisit("Du bist jetzt angemeldet 👍");
        location.pathname = "/";
        // Or set the user from the response
      })
      .catch((reason) => {
        switch (reason.status) {
          case 401:
            error("Benutzername oder Passwort sind falsch 😬");
            break;
          default:
            error();
        }
      })
      .finally(() => {
        loading = false;
      });
  };
</script>

<main class="px-6">
  <h1 class="text-2xl font-bold">Willkommen Zurück 👋</h1>
  <div class="text-lg text-gray-500">Schön dich wieder zu sehen.</div>

  <form use:form class="mt-20" on:submit|preventDefault={login}>
    <TextFieldWithIcon
      name="username"
      placeholder="Benutzername"
      icon={faUser}
    />

    <div class="h-3" />

    <TextFieldWithIcon
      name="password"
      placeholder="Passwort"
      type="password"
      icon={faLock}
    />

    <div class="mt-3 flex justify-end">
      <a href="/implement">Passwort vergessen?</a>
    </div>
    <div class="h-6" />

    <Button {loading} valid={$form.valid}>Anmelden</Button>

    <div class="h-6" />
    <div class="flex justify-center items-center">
      <a href="./registrieren"
        >Neu hier? <span class="text-primary text-opacity-70 underline"
          >Registrieren</span
        ></a
      >
    </div>
  </form>
</main>

<svelte:head>
  <title>Login</title>
</svelte:head>
