<script context="module">
  export async function load({ stuff }) {
    return { props: stuff };
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";
  import api from "$lib/api";
  import ButtonBar from "$lib/components/ButtonBar.svelte";
  import TitleDescriptionLayout from "$lib/components/layouts/TitleDescriptionLayout.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import { error, success } from "$lib/components/Toaster/toast";
  import { Word } from "@prisma/client";
  import {
    Hint,
    minLength,
    required,
    useForm,
    validators,
  } from "svelte-use-form";

  export let word: Word;

  const form = useForm();

  function submit() {
    const body = $form.values;
    console.log(body);

    api
      .put(`/api/words/${word.id}/participle-past`, body)
      .then(() => {
        $session.invalidate();
        goto(".").then(() => success("Partizip II zugefügt"));
      })
      .catch(() => error());
  }
</script>

<Nav />
<main>
  <TitleDescriptionLayout>
    <div slot="title">Partizip II hinzufügen</div>
    <div slot="description">
      Das Partizip II für das Wort
      <span class="font-bold text-black">
        {word.swissGerman}
      </span>
      hinzufügen. Da die schweizerdeutschen Dialekte kein Präteritum haben, wird
      hauptsächlich das
      <span class="italic">Perfekt</span>
      verwendet, welches aus dem Partizip II besteht.
    </div>

    <form use:form on:submit|preventDefault={submit}>
      <input
        type="text"
        class="textfield"
        name="participlePast"
        use:validators={[required, minLength(word.swissGerman.length)]}
      />
      <Hint for="participle-past" on="minLength">Zu kurz</Hint>
      <ButtonBar valid={$form.valid}>Hinzufügen</ButtonBar>
    </form>
  </TitleDescriptionLayout>
</main>
