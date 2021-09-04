<script lang="ts">
  import type { User, Interpretation, Meaning } from "@prisma/client";
  import Examples from "./_Examples.svelte";
  import { Swiper, SwiperSlide } from "swiper/svelte";
  import Icon from "$lib/components/Icon";
  import { faPlus } from "@fortawesome/free-solid-svg-icons";
  import { page, session } from "$app/stores";
  import { goto } from "$app/navigation";
  import Voting from "./_Voting.svelte";
  import { warn } from "$lib/components/Toaster/toast";
  import "swiper/css";
  import { r } from "$lib/utils/meta-content";

  export let interpretations: (Interpretation & {
    createdBy: User;
    upvotes: User[];
    downvotes: User[];
    meanings: Meaning[];
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

          <h1 class="font-bold text-lg">Interpretation</h1>

          <div class="h-2" />

          <ol class={r("list-decimal", interpretation.meanings.length > 1)}>
            {#each interpretation.meanings as meaning}
              <li class={r("ml-5", interpretation.meanings.length > 1)}>
                <div>
                  {meaning.explanation}
                </div>

                {#if meaning.examples.length}
                  <div class="font-semibold">Beispiele:</div>
                  <ul class="list-disc ml-5">
                    {#each meaning.examples as example}
                      <li>
                        <div class="italic">{example}</div>
                      </li>
                    {/each}
                  </ul>
                {/if}

                <div class="h-3" />
              </li>
            {/each}
          </ol>
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
  <div class="h-23 flex justify-center items-center">
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
