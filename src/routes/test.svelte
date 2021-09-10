<script lang="ts">
  import api from "$lib/api";
  import { onMount } from "svelte";

  let audioSource;

  const record = async () => {
    const recordedChunks = [];

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener("dataavailable", (ev) => {
      recordedChunks.push(ev.data);
    });

    mediaRecorder.addEventListener("stop", async () => {
      const blob = new Blob(recordedChunks, { type: "audio/mpeg" });
      // api
      //   .post("/api/words/1/audio-samples", blob)
      //   .then((result) => console.log(result));

      fetch("/api/words/1/audio-samples", {
        method: "POST",
        body: blob,
      });
      const audioURL = URL.createObjectURL(blob);
      audioSource = audioURL;
    });
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 2000);
  };

  onMount(() => {});
</script>

<button on:click={record}> Record audio </button>
<button> Finish Recording </button>
<hr />
{audioSource}
<audio src={audioSource} controls />
