<script lang="ts">
  import api from "$lib/api";
  import { error, successNextVisit } from "$lib/components/Toaster/toast";

  import { faAt, faLock } from "@fortawesome/free-solid-svg-icons";
  import { minLength, required, useForm } from "svelte-use-form";
  import Button from "../../../lib/components/Button.svelte";
  import TextFieldWithIcon from "../_TextFieldWithIcon.svelte";

  let loading = false;

  const form = useForm({
    email: { validators: [required, minLength(4)] },
    password: { validators: [required, minLength(5)] },
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
            if (reason.headers.get("reason") === "verified") {
              error("Du musst zuerst deine E-Mail-Adresse bestätigen", 4000);
            } else {
              error("Benutzername oder Passwort sind falsch 😬");
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
  <h1 class="text-2xl font-bold">Willkommen Zurück 👋</h1>
  <div class="text-lg text-gray-500">Schön dich wieder zu sehen.</div>

  <form use:form class="mt-20" on:submit|preventDefault={login}>
    <TextFieldWithIcon name="email" placeholder="E-Mail" icon={faAt} />

    <div class="h-3"></div>

    <TextFieldWithIcon
      name="password"
      placeholder="Passwort"
      type="password"
      icon={faLock}
    />

    <div class="mt-3 flex justify-end">
      <a href={"passwort-vergessen?email=" + $form.email.value}
        >Passwort vergessen?</a
      >
    </div>
    <div class="h-6"></div>

    <Button {loading} valid={$form.valid}>Anmelden</Button>

    <div class="h-6"></div>
    <div class="flex justify-center items-center">
      <a href="./registrieren">
        Neu hier?
        <span class="text-primary text-opacity-70 underline">Registrieren</span>
      </a>
    </div>
  </form>
</main>

<svelte:head>
  <title>Anmelden</title>
</svelte:head>
