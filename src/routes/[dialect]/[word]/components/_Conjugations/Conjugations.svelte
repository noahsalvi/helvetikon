<script lang="ts">
  import Subtitle from "$lib/components/Subtitle.svelte";

  import { Grammar, VerbConjucation } from "@prisma/client";
  import ConjugationTable from "./ConjugationTable.svelte";

  export let grammar: Grammar & {
    verbPresent?: VerbConjucation;
    verbConditionalI?: VerbConjucation;
    verbConditionalII?: VerbConjucation;
  };
  grammar.verbPresent = grammar.verbPresent ?? ({} as any);
  grammar.verbConditionalI = grammar.verbConditionalI ?? ({} as any);
  grammar.verbConditionalII = grammar.verbConditionalII ?? ({} as any);
</script>

<section class="mx-3">
  <Subtitle>Grammatik</Subtitle>

  <div class="flex flex-wrap gap-5">
    <ConjugationTable title="Präsens" conjugation={grammar.verbPresent} />
    <ConjugationTable
      title="Konjunktiv I"
      conjugation={grammar.verbConditionalI}
    />
    <ConjugationTable
      title="Konjunktiv II"
      conjugation={grammar.verbConditionalII}
    />
  </div>
</section>
