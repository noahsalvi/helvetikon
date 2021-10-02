<script lang="ts">
  import { page } from "$app/stores";

  import api from "$lib/api";
  import { error, successNextVisit } from "$lib/components/Toaster/toast";
  import { faAt } from "@fortawesome/free-solid-svg-icons";
  import { email, required, useForm } from "svelte-use-form";
  import Button from "../../../lib/components/Button.svelte";
  import TextFieldWithIcon from "../_TextFieldWithIcon.svelte";

  let loading = false;

  const queryEmail = $page.query.get("email");

  const form = useForm({
    email: { validators: [required, email], initial: queryEmail },
  });

  const forget = () => {
    loading = true;
    const data = $form.values;
    api
      .post("/api/auth/forgot", data)
      .then((_) => {
        successNextVisit(
          "Anfrage wurde verarbeitet, prüfe deinen Posteingang 📨",
          4000
        );
        location.replace("/");
      })
      .catch((reason) => {
        error();
      })
      .finally(() => {
        loading = false;
      });
  };
</script>

<main class="px-6">
  <h1 class="text-2xl font-bold">Passwort vergessen?</h1>
  <div class="text-lg text-gray-500 max-w-prose">
    Gib folgend die E-Mail-Adresse deines Benutzers an. Falls ein Konto
    existiert, wirst du ein E-Mail erhalten, mit welchem du dein Passwort
    zurücksetzen kannst. <br /><br />
    Keine Sorge, das passiert uns allen… 😅
  </div>

  <form use:form class="mt-10" on:submit|preventDefault={forget}>
    <TextFieldWithIcon
      name="email"
      placeholder="E-Mail"
      value={$page.query.get("email")}
      icon={faAt}
    />

    <div class="h-6" />

    <Button {loading} valid={$form.valid}>Senden</Button>

    <div class="h-6" />
    <div class="flex justify-center items-center">
      <a href="./anmelden">
        Erinnerst du dich doch noch?
        <span class="text-primary text-opacity-70 underline"> Anmelden </span>
      </a>
    </div>
  </form>
</main>

<svelte:head>
  <title>Passwort vergessen?</title>
</svelte:head>
