<script lang="ts">
  import type { User, WordInterpretation } from ".prisma/client";
  import Examples from "./_Examples.svelte";
  import { Swiper, SwiperSlide } from "swiper/svelte";
  import Icon from "$lib/components/Icon";
  import { faPlus } from "@fortawesome/free-solid-svg-icons";
  import { page, session } from "$app/stores";
  import { goto } from "$app/navigation";
  import Voting from "./_Voting.svelte";
  import { warn } from "$lib/components/Toaster/toast";
  import "swiper/css";

  export let interpretations: (WordInterpretation & {
    createdBy: User;
    upvotes: User[];
    downvotes: User[];
  })[];

  let activeIndex = 0;

  const updateActiveIndex = (e) => {
    activeIndex = e.detail[0][0].activeIndex;
  };

  const addInterpretation = () => {
    if (!$session.user)
      return warn("Melde dich an, um Interpretationen hinzuzufügen");
    goto(`${$page.path}/interpretation-hinzufügen`);
  };

  const belongsToUser = (user: User) => {
    return user.username === $session.user?.username;
  };

  $: slidesLength = interpretations.length + 1;
</script>

<section>
  <Swiper on:slideChange={updateActiveIndex}>
    {#each interpretations as interpretation}
      <SwiperSlide>
        <div
          class="relative mx-3 mb-1 p-3 rounded-lg bg-white border-3 border-light-300 filter drop-shadow"
        >
          {#if belongsToUser(interpretation.createdBy)}
            <a
              href="{$page.path}/interpretationen/{interpretation.id}/bearbeiten"
              class="absolute top-0 right-0 p-3 text-sm text-primaryDark"
            >
              Bearbeiten
            </a>
          {/if}

          <div class="font-bold">Bedeutung</div>
          <div>
            {interpretation.meaning}
          </div>

          <div class="h-3" />
          {#if interpretation.examples.length}
            <div class="font-bold">Beispiele</div>
            <div class="italic">"{interpretation.examples[0]}"</div>
          {/if}
          <Examples examples={interpretation.examples} />

          <div class="h-3" />

          <div class="flex justify-between items-baseline">
            <div>@{interpretation.createdBy.username}</div>

            <Voting
              interpretationId={interpretation.id}
              upvotes={interpretation.upvotes}
              downvotes={interpretation.downvotes}
            />
          </div>
        </div>
        <!-- <div class="h-10 bg-green-100" /> -->
      </SwiperSlide>
    {/each}
    <SwiperSlide>
      <div
        on:click={addInterpretation}
        class="mx-3 py-6 px-3
        flex flex-col items-center justify-center gap-4
        rounded-lg border-3 border-dashed border-light-800 filter drop-shadow"
      >
        <Icon data={faPlus} class="text-coal !block w-8 h-8" />
        <div class="textxl text-coal">Interpretation hinzufügen</div>
      </div>
    </SwiperSlide>
  </Swiper>

  <!-- Bottom Overview thingy -->
  <div class="h-20 flex justify-center items-center">
    <div class="flex space-x-2">
      {#each new Array(slidesLength) as _, index}
        <div
          class="h-2 w-2 rounded-full last:bg-opacity-50
          {index === activeIndex ? 'bg-primary' : 'bg-gray-300'}"
        />
      {/each}
    </div>
  </div>
</section>
