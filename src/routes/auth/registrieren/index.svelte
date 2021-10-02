<script lang="ts">
  import { goto } from "$app/navigation";
  import api from "$lib/api";
  import Icon from "$lib/components/Icon";
  import { error } from "$lib/components/Toaster/toast";
  import config from "$lib/config";
  import dialects from "$lib/dialects";
  import { passwordMatch } from "$lib/validators/password-match";
  import {
    faAt,
    faGlobeEurope,
    faLock,
    faUser,
  } from "@fortawesome/free-solid-svg-icons";
  import { onDestroy } from "svelte";
  import {
    email,
    maxLength,
    minLength,
    required,
    useForm,
  } from "svelte-use-form";
  import Button from "../../../lib/components/Button.svelte";
  import TextFieldWithIcon from "../_TextFieldWithIcon.svelte";
  import { registrationState } from "./registrationState";

  let loading = false;

  const form = useForm({
    nickname: {
      validators: [required, minLength(4), maxLength(20)],
    },
    email: {
      validators: [required, email],
    },
    password: {
      validators: [required, minLength(5), maxLength(20)],
    },
    passwordRepeat: {
      validators: [required, passwordMatch],
    },
  });

  const register = () => {
    const data = { ...$form.values, dialect: $registrationState.dialect };
    loading = true;

    api
      .post("/api/auth/register", data)
      .then((_) => {
        goto("verifizieren");
      })
      .catch(async (reason: Response) => {
        switch (reason.status) {
          case 409:
            if ((await reason.text()).includes("Username")) {
              error("Der Benutzername ist bereits vergeben");
            } else {
              error("Die E-Mail-Adresse wird bereits genutzt");
            }
            break;
          default:
            error();
        }
      })

      .finally(() => {
        loading = false;
      });
  };

  onDestroy(() => {
    $registrationState = { ...$registrationState, ...$form.values };
  });

  $: valid = $form.valid && !!$registrationState.dialect;
</script>

<main class="px-6">
  <h1 class="text-2xl font-bold">Registrieren 📑</h1>
  <div class="text-lg text-gray-500">
    Hier kannst du dich registrieren um ein Mitglied von {config.appName} zu werden.
  </div>

  <form use:form class="mt-10" on:submit|preventDefault={register}>
    <TextFieldWithIcon
      name="nickname"
      placeholder="Spitzname"
      value={$registrationState.nickname}
      icon={faUser}
    />

    <div class="h-3" />

    <TextFieldWithIcon
      name="email"
      placeholder="E-Mail"
      value={$registrationState.email}
      icon={faAt}
    />

    <div class="h-3" />

    <TextFieldWithIcon
      name="password"
      placeholder="Passwort"
      type="password"
      value={$registrationState.password}
      icon={faLock}
    />

    <div class="h-3" />

    <TextFieldWithIcon
      name="passwordRepeat"
      placeholder="Passwort wiederholen"
      type="password"
      value={$registrationState.passwordRepeat}
      icon={faLock}
    />

    <div class="h-3" />

    <a
      href="registrieren/dialekt"
      class="relative block w-full h-14 pl-12 pr-2 bg-light-700 rounded-lg text-xl flex items-center"
    >
      <Icon
        data={faGlobeEurope}
        class="text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2"
      />
      {#if $registrationState.dialect}
        {dialects[$registrationState.dialect]?.name}
      {:else}
        <span class="text-gray-500"> Dialekt auswählen </span>
      {/if}
    </a>

    <div class="h-6" />

    <Button {loading} {valid}>Registrieren</Button>

    <div class="h-6" />
    <div class="flex justify-center items-center">
      <a href="./anmelden">
        Du hast bereits ein Account?
        <span class="text-primary text-opacity-70 underline">Anmelden</span>
      </a>
    </div>
  </form>
</main>

<svelte:head>
  <title>Registrieren</title>
</svelte:head>
