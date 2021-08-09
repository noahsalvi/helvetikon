<script lang="ts">
  import api from "$lib/api";

  import { faAt, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
  import config from "$lib/config";
  import {
    email,
    maxLength,
    minLength,
    required,
    useForm,
  } from "svelte-use-form";
  import Button from "../../../lib/components/Button.svelte";
  import TextFieldWithIcon from "../_TextFieldWithIcon.svelte";

  let loading = false;

  const passwordMatch = (value, f) => {
    if (value !== f.values.password) {
      return { passwordMatch: true };
    }
  };

  const form = useForm({
    username: { validators: [required, minLength(4), maxLength(20)] },
    email: { validators: [required, email] },
    password: { validators: [required, minLength(5), maxLength(20)] },
    passwordRepeat: { validators: [required, passwordMatch] },
  });

  const register = () => {
    const data = $form.values;

    loading = true;

    api
      .post("/api/auth/register", data)

      .then((_) => {
        location.pathname = "/";
        // Or set the user from the response
      })
      .catch(async (reason: Response) => {
        alert(await reason.text());
      })

      .finally(() => {
        loading = false;
      });
  };
</script>

<main class="px-6">
  <h1 class="text-2xl font-bold">Registrieren 📑</h1>
  <div class="text-lg text-gray-500">
    Hier kannst du dich registrieren um ein Mitglied von {config.appName} zu werden.
  </div>

  <form use:form class="mt-20" on:submit|preventDefault={register}>
    <TextFieldWithIcon
      name="username"
      placeholder="Benutzername"
      icon={faUser}
    />

    <div class="h-3" />

    <TextFieldWithIcon name="email" placeholder="E-Mail" icon={faAt} />

    <div class="h-3" />

    <TextFieldWithIcon
      name="password"
      placeholder="Passwort"
      type="password"
      icon={faLock}
    />

    <div class="h-3" />

    <TextFieldWithIcon
      name="passwordRepeat"
      placeholder="Passwort wiederholen"
      type="password"
      icon={faLock}
    />

    <div class="h-6" />

    <Button {loading} valid={$form.valid}>Registrieren</Button>

    <div class="h-6" />
    <div class="flex justify-center items-center">
      <a href="./anmelden"
        >Du hast bereits ein Account? <span
          class="text-primary text-opacity-70 underline">Anmelden</span
        ></a
      >
    </div>
  </form>
</main>

<svelte:head>
  <title>Registrieren</title>
</svelte:head>
