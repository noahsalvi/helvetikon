<script lang="ts">
  import { page } from "$app/stores";
  import api from "$lib/api";
  import Icon from "$lib/components/Icon";
  import { warn } from "$lib/components/Toaster/toast";
  import {
    faArrowCircleDown,
    faArrowCircleUp,
  } from "@fortawesome/free-solid-svg-icons";
  type PublicUser = { username: string };

  export let interpretationId: number;
  export let upvotes: PublicUser[];
  export let downvotes: PublicUser[];

  const upvote = () => {
    const currentUser = $page.data.user;
    const upvoteIndex = upvotes.findIndex(
      (vote) => vote.username === currentUser.username
    );

    let upvote: boolean;
    if (upvoteIndex >= 0) {
      upvotes = upvotes.splice(upvoteIndex, 1);
      upvote = false;
    } else {
      upvotes = [...upvotes, currentUser];
      downvotes = downvotes.filter((d) => d.username !== currentUser?.username);
      upvote = true;
    }

    vote({ upvote, downvote: false });
  };

  const downvote = () => {
    const currentUser = $page.data.user;
    const downvoteIndex = downvotes.findIndex(
      (vote) => vote.username === currentUser.username
    );

    let downvote: boolean;
    if (downvoteIndex >= 0) {
      downvotes = downvotes.splice(downvoteIndex, 1);
      downvote = false;
    } else {
      downvotes = [...downvotes, currentUser];
      upvotes = upvotes.filter((u) => u.username !== currentUser?.username);
      downvote = true;
    }

    vote({ upvote: false, downvote });
  };

  const vote = ({ upvote, downvote }) => {
    api
      .put(`/api/interpretations/${interpretationId}/vote`, {
        upvote,
        downvote,
      })
      .then((response) => {
        upvotes = response.upvotes;
        downvotes = response.downvotes;
      });
  };

  const authorizeVote = (callback) => {
    if (!$page.data.user) return warn("Nur angemeldete Nutzer dürfen abstimmen");
    callback();
  };

  $: score = upvotes.length - downvotes.length;
  $: selfUpvote = upvotes.find(
    (vote) => vote.username === $page.data.user?.username
  );
  $: selfDownvote = downvotes.find(
    (vote) => vote.username === $page.data.user?.username
  );
</script>

<div class="h-7 flex items-center gap-2">
  <button on:click={() => authorizeVote(upvote)} class="h-full">
    <Icon
      data={faArrowCircleUp}
      class="text-primary w-auto !block h-full
    {selfUpvote ? '' : 'opacity-50'}"
    />
  </button>
  {score}
  <button on:click={() => authorizeVote(downvote)} class="h-full">
    <Icon
      data={faArrowCircleDown}
      class="text-black w-auto !block h-full
    {selfDownvote ? '' : 'opacity-20'}"
    />
  </button>
</div>
