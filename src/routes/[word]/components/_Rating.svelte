<script lang="ts">
  import { session } from "$app/stores";
  import api from "$lib/api";

  import Icon from "$lib/components/Icon";
  import {
    faArrowCircleDown,
    faArrowCircleUp,
  } from "@fortawesome/free-solid-svg-icons";
  import type { User } from "@prisma/client";

  export let id: number;
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
      downvote = true;
    }

    vote({ upvote: false, downvote });
  };

  const vote = ({ upvote, downvote }) => {
    api
      .put(`api/interpretations/${id}/vote`, { upvote, downvote })
      .then((response) => {
        upvotes = response.upvotes;
        downvotes = response.downvotes;
      });
  };

  console.log(upvotes, downvotes);

  $: score = upvotes.length - downvotes.length;
  $: selfUpvote = upvotes.find(
    (upvote) => upvote.username === $session.user.username
  );
  $: selfDownvote = downvotes.find(
    (downvote) => downvote.username === $session.user.username
  );
</script>

<div class="h-5 flex items-center gap-2">
  <button on:click={upvote}>
    <Icon
      data={faArrowCircleUp}
      class="text-primary w-auto !block h-full
    {selfUpvote ? '' : 'opacity-50'}"
    />
  </button>
  {score}
  <button on:click={downvote}>
    <Icon
      data={faArrowCircleDown}
      class="text-black w-auto !block h-full
    {selfDownvote ? '' : 'opacity-20'}"
    />
  </button>
</div>
