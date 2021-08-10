<script lang="ts">
  import { session } from "$app/stores";
  import api from "$lib/api";
  import Icon from "$lib/components/Icon";
  import { warn } from "$lib/components/Toaster/toast";
  import {
    faArrowCircleDown,
    faArrowCircleUp,
  } from "@fortawesome/free-solid-svg-icons";
  import type { User } from "@prisma/client";

  export let interpretationId: number;
  export let upvotes: User[];
  export let downvotes: User[];

  const upvote = () => {
    const upvoteIndex = upvotes.findIndex(
      (upvote) => upvote.username === $session.user.username
    );

    let upvote: boolean;
    if (upvoteIndex >= 0) {
      upvotes = upvotes.splice(upvoteIndex, 1);
      upvote = false;
    } else {
      upvotes = [...upvotes, $session.user];
      downvotes = downvotes.filter(
        (d) => d.username !== $session.user?.username
      );
      upvote = true;
    }

    vote({ upvote, downvote: false });
  };

  const downvote = () => {
    const downvoteIndex = downvotes.findIndex(
      (downvote) => downvote.username === $session.user.username
    );

    let downvote: boolean;
    if (downvoteIndex >= 0) {
      downvotes = downvotes.splice(downvoteIndex, 1);
      downvote = false;
    } else {
      downvotes = [...downvotes, $session.user];
      upvotes = upvotes.filter((u) => u.username !== $session.user?.username);
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
    if (!$session.user) return warn("Nur angemeldete Nutzer dürfen abstimmen");
    callback();
  };

  $: score = upvotes.length - downvotes.length;
  $: selfUpvote = upvotes.find(
    (upvote) => upvote.username === $session.user?.username
  );
  $: selfDownvote = downvotes.find(
    (downvote) => downvote.username === $session.user?.username
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
