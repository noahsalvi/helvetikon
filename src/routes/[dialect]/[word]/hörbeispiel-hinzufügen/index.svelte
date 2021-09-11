<script context="module">
  export async function load({ page, fetch }) {
    const { dialect: dialectSlug, word } = page.params;
    const dialect = Object.entries(dialects).find(
      ([_, dialect]) => dialect.slug === dialectSlug
    )?.[0];
    if (!dialect) return;

    const result = await fetch(`/api/words/${dialect}/${word}`);
    const wordData = await result.json();

    return { props: { word: wordData } };
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import Fab from "$lib/components/Fab.svelte";
  import Icon from "$lib/components/Icon";
  import Nav from "$lib/components/Nav.svelte";
  import { error, success } from "$lib/components/Toaster/toast";
  import dialects from "$lib/dialects";
  import {
    faArrowLeft,
    faMicrophone,
    faPlay,
    faStop,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";
  import type { Word } from "@prisma/client";
  import { onMount } from "svelte";

  export let word: Word;

  let mediaRecorder: MediaRecorder;
  let wavesurfer: any;
  let blob: Blob;
  let playing = false;
  let recording = false;
  let loading = false;

  const publish = async () => {
    loading = true;

    const path = `/api/words/${word.id}/audio-samples`;
    fetch(path, { method: "POST", body: blob })
      .then((response) => {
        if (response.ok) {
          goto(".").then(() => success("Hörbeispiel wurde hinzugefügt 👍"));
        } else {
          error();
        }
      })
      .finally(() => {
        loading = false;
      });
  };

  const startRecording = async () => {
    recording = true;

    const recordedChunks = [];

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener("dataavailable", (ev) => {
      recordedChunks.push(ev.data);
    });

    mediaRecorder.addEventListener("stop", async () => {
      stream.getTracks().forEach((track) => track.stop());
      blob = new Blob(recordedChunks, { type: "audio/mpeg" });
      const audioURL = URL.createObjectURL(blob);
      wavesurfer.load(audioURL);
    });
    mediaRecorder.start();
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    recording = false;
  };

  const deleteRecording = () => {
    playing = false;
    blob = null;
    wavesurfer.empty();
  };

  const playRecording = async () => {
    wavesurfer.play();
    playing = true;
  };

  onMount(async () => {
    const WaveSurfer = (await import("wavesurfer.js")).default;
    wavesurfer = WaveSurfer.create({
      container: "#waveform",

      interact: false,
    });

    wavesurfer.on("finish", () => {
      playing = false;
    });
  });
</script>

<Nav />

<main class="container px-3 text-lg">
  <div class="h-10" />
  <h1 class="font-bold text-[38px] text-coal mb-2">
    {word.swissGerman}
  </h1>

  <hr class="bg-primary h-1 rounded mb-3" />
  <h2>Starte die Aufnahme und sag '{word.swissGerman}' ins Mikrofon</h2>
  <div id="waveform" class="min-h-50" />
  {#if blob}
    <div class="h-16 text-white flex justify-center gap-2">
      <button
        on:click={playing ? null : playRecording}
        class="h-full w-30 bg-dark-500 rounded-full"
      >
        <Icon data={playing ? faStop : faPlay} />
      </button>
      <Button
        on:click={publish}
        {loading}
        class="h-full font-semibold bg-primary w-70 rounded-full"
      >
        Veröffentlichen
      </Button>
    </div>
  {:else}
    <div class="flex justify-center">
      <button
        on:click={recording ? stopRecording : startRecording}
        class="bg-primary mx-auto h-16 w-16 rounded-full shadow-lg svg:(text-white h-7 w-7)"
      >
        <Icon data={recording ? faStop : faMicrophone} />
      </button>
    </div>
  {/if}
  <div class="h-26" />

  <Fab
    icon={blob ? faTimes : faArrowLeft}
    on:click={blob ? deleteRecording : () => goto("./")}
  />
</main>

<svelte:head>
  <title>Hörbeispiel Hinzufügen | {word.swissGerman}</title>
</svelte:head>
