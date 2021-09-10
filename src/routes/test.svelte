<script>
  import { browser } from "$app/env";
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
      if (ev.data.size > 0) {
        recordedChunks.push(ev.data);
      } else {
        console.log("this is actually needed lol");
      }
    });

    mediaRecorder.addEventListener("stop", () => {
      const blob = new Blob(recordedChunks, { type: "audio/mpeg" });
      console.log(blob);
      const audioURL = URL.createObjectURL(blob);
      audioSource = audioURL;
    });
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 3000);
  };

  onMount(() => {});
</script>

<button on:click={record}> Record audio </button>
<button> Finish Recording </button>
<hr />
{audioSource}
<audio src={audioSource} controls />
