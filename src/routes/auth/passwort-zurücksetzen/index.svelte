<script context="module" lang="ts">
  // jsonwebtoken 8.5.1 doesn't work clientside in @sveltejs/kit 1.0.0-next.150 tha'ts why we use a different one
  import jwtDecode from "jwt-decode";

  export function load({ page }) {
    const user = jwtDecode<{ email: string }>(page.query.get("token"));
    return { props: { user } };
  }
</script>

<script lang="ts">
  import api from "$lib/api";
  import {
    error,
    successNextVisit,
    toast,
    warn,
    warnNextVisit,
  } from "$lib/components/Toaster/toast";

  import {
    faAt,
    faLock,
    faUserFriends,
  } from "@fortawesome/free-solid-svg-icons";
  import { email, minLength, required, useForm } from "svelte-use-form";
  import Button from "../../../lib/components/Button.svelte";
  import TextFieldWithIcon from "../_TextFieldWithIcon.svelte";
  import { page } from "$app/stores";
  import { passwordMatch } from "$lib/validators/password-match";
  import { ToastType } from "$lib/components/Toaster/toastProps";

  const token = $page.query.get("token");
  export let user: { username: string; email: string };

  let loading = false;

  const form = useForm({
    password: { validators: [required, minLength(5)] },
    passwordMatch: { validators: [required, passwordMatch] },
  });

  const reset = () => {
    loading = true;
    const data = { password: $form.password.value };

    api
      .post("/api/auth/reset?token=" + token, data)
      .then((_) => {
        successNextVisit(
          "Dein Passwort wurde geändert, du bist jetzt angemeldet 👍",
          3000
        );

        location.pathname = "/";
        // Or set the user from the response
      })
      .catch((response) => {
        switch (response.status) {
          case 401:
            switch (response.headers.get("reason")) {
              case "expired":
                toast({
                  content: "Nochmal versuchen?",
                  type: ToastType.Error,
                  link: {
                    href: "/auth/passwort-vergessen?email=" + user.email,
                    title: "Hier",
                  },
                  timeout: 5000,
                });

                error("Der Link ist bereits abgelaufen 😕", 5000);
                break;

              default:
                error("Etwas stimmt mit dem Token nicht 😑");
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
</script>

<main class="px-6">
  <h1 class="text-2xl font-bold">Passwort zurücksetzen</h1>
  <div class="text-lg text-gray-500">
    Setze ein neues Passwort für den Benutzer:
    <span class="font-bold">{user.username}</span><br />
    Keine Angst, das passiert uns allen mal 🤣
  </div>

  <form use:form class="mt-20" on:submit|preventDefault={reset}>
    <TextFieldWithIcon
      name="email"
      placeholder="E-Mail"
      value={user.email}
      disabled
      icon={faAt}
    />

    <div class="h-3" />

    <TextFieldWithIcon
      name="password"
      placeholder="Passwort"
      type="password"
      icon={faLock}
    />

    <div class="h-3" />

    <TextFieldWithIcon
      name="passwordMatch"
      placeholder="Passwort wiederholen"
      type="password"
      icon={faLock}
    />

    <div class="h-6" />

    <Button {loading} valid={$form.valid}>Passwort setzen</Button>

    <div class="h-6" />
    <div class="flex justify-center items-center">
      <a href="./registrieren">
        Neu hier?
        <span class="text-primary text-opacity-70 underline">
          Registrieren
        </span>
      </a>
    </div>
  </form>
</main>

<svelte:head>
  <title>Login</title>
</svelte:head>
