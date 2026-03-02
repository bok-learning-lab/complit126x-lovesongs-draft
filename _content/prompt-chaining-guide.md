---
title: "Workshop"
nav_title: "Workshop"
sidebar_position: 2
phase: 2
tags: ["workshop", "prompt chaining", "python", "code"]
description: "The workshop session: reviewing the pre-workshop demos, frameworks for your chain, and a practical guide to building it."
next_page: "next-steps"
---

# Workshop

*Unit II: Voice, Style, and Form — Workshop Session*

---

**In this guide:**

1. [Frameworks](#frameworks) — Three structures for organizing the operations in your chain before you write any code (STAR, Communication Model, Dramatistic Pentad)
2. [A Bank of Operations](#a-bank-of-operations) — The atomic steps you'll combine, in any order
3. [The Basic Chain, Step by Step](#the-basic-chain-step-by-step) — Each step in sequence: Score → Extract → Annotate → Build Context → Generate → Compare
4. [Going Further](#going-further-other-chain-configurations) — Other configurations: parallel tracks, feedback loops, branching by form

---

## Where We Left Off

Before this session, you ran the spider chart and saw what a purely numerical representation of a poem produces when used to generate new text: something in the right emotional register, but without specificity. You tried feeding sonnets directly into a prompt, and you heard generated text read aloud in a synthesized voice.

The through-line across all three demos: the output works as a mood, not as a voice. The numbers capture *dimensions* of a poem — how melancholic it is, how romantic — without capturing the specific images, syntactic habits, and formal moves that make those qualities feel like one particular writer's. That gap is real. Closing it is what prompt chaining is for.

Context engineering and prompt chaining are not magic. They are sequences of focused operations — each one doing one thing, each one passing something to the next. The question for today is: which operations, in which order, for your poet?

---

## Frameworks

Before you start building, it helps to have a skeleton — a way to organize the operations in your chain before you decide what goes where. Frameworks from other fields give you a starting vocabulary: structures already tested for moving raw material through staged refinement.

Pick one below (or find your own), slot operations into its slots, then decide on movement: do the operations chain linearly, loop, branch, or hand control back to you? Plan it on paper before you write any code.

---

### STAR — Situation, Task, Action, Result

Originally a job-interview preparation structure, recently tested as a prompt architecture. [Jo (2026)](https://arxiv.org/abs/2602.21814) found that STAR-structured prompts reached 85% accuracy on an implicit-constraint reasoning task where bare prompts scored 0% — because the **Task** step forces explicit goal articulation before any output is generated.

| Slot | Question to answer | Example |
|---|---|---|
| **Situation** | What are you working from? | 3 Whitman poems; I want to capture his long-line cataloguing and direct address |
| **Task** | What would a successful output actually do? | A poem that sounds like it comes from the same place — not a copy, but recognizably his |
| **Action** | Which operations, in which order? | Score → Extract → Annotate → Build Context → Generate → Judge |
| **Result** | How will you know if it worked? | Compare against scores-only output; identify what the chain added |

The key move is the Task step. Defining success *before* you build the chain forces you to think about what "voice" means for your poet — which is the hard question this exercise is organized around.

---

### Communication Model — Speaker, Message, Audience

This model reflects a classical rhetorical structure in which each message connects a Speaker to an Audience via two dimensions: Form (how something is said) and Content (what is said).

```
Speaker ──┬──▶ Form ─────┬──▶ Audience
          │      │       │
          └──▶ Content ──┘
                (Message)
```

| Slot | What it maps to in a voice chain |
|---|---|
| **Speaker** | The source poet — your input poems and what you extract from them |
| **Form** | Syntactic habits, line structure, rhythm, formal choices — separable from content |
| **Content** | Themes, poetic images, recurring concerns — what the poems are about |
| **Audience** | Who the generated text is for, and in what context it will be read |

This framework draws attention to a split the spider chart collapses: Form and Content can be extracted in separate steps, weighted differently, and passed to the generation step as distinct variables. The interesting design question is whether your poet's voice lives more in Form or in Content — and what happens to the output when you give the model one but not the other.

---

### Dramatistic Pentad — Act, Scene, Agent, Agency, Purpose

Kenneth Burke's [Dramatistic Pentad](https://en.wikipedia.org/wiki/Dramatistic_pentad) is a framework for analyzing any human action by asking five questions simultaneously. Where STAR sequences steps and the Communication Model separates form from content, the Pentad asks you to hold five dimensions in tension at once — and to notice which *ratio* (Act:Agent, Agency:Purpose, etc.) dominates your design.

| Slot | Question | What it maps to in a voice chain |
|---|---|---|
| **Act** | What is being done? | The output itself — a sonnet, a chorus, a spoken-word verse |
| **Scene** | In what context? | Formal constraints, genre, platform — where the output lives |
| **Agent** | Who is doing it? | The source poet — and, separately, the model executing the steps |
| **Agency** | By what means? | The operations in the chain — extraction, annotation, generation |
| **Purpose** | To what end? | Your argument about what voice *is* for this poet |

The most useful design question the Pentad raises is about **ratios**: which term drives the others? A chain dominated by *Agency* (the operations) produces different outputs than one dominated by *Purpose* (the goal). If your chain front-loads extraction and annotation, you're running an Agency:Act ratio — the means shape the output. If you define the purpose first (as STAR's Task step requires), you're running a Purpose:Agency ratio. The Pentad doesn't tell you which is correct; it makes the choice visible.

---

Each framework is a skeleton for organizing operations, not a formula. Once you've chosen one and slotted in your operations, the remaining design decisions are about movement: does the chain run linearly, loop back on a judge step, branch into parallel tracks, or pause for your input partway through?

---

## A Practical Guide to Building Your Chain

*The rest of this page is the technical guide. The [Appendix](/reading/appendix-open-game) has some intellectual history for those who want it.*

---

## The Core Idea

A prompt chain is a sequence of calls where **the output of one step becomes part of the input for the next**. Each arrow is a separate API call doing one focused thing.

You've already run the simplest possible version of this. The spider chart is a two-step chain:

```
Poem ──▶ [Score] ──▶ trait values
                          │
                          ▼
                    [Generate] ──▶ sonnet
```

Step 1 compresses a poem into numbers. Step 2 generates new text from those numbers. That's the whole thing — and you saw exactly what it costs: the sonnet comes out in the right register, but it sounds like no one in particular.

The fuller chain you'll build today adds steps between Score and Generate — steps that preserve more of the actual language before it gets compressed away:

```
Poem ──▶ [Score]   ──▶ trait values     ─┐
Poem ──▶ [Extract] ──▶ phrases, images  ─┤
          [Annotate: you]               ─┼──▶ [Build Context] ──▶ [Generate] ──▶ draft
          ... repeat for 3+ poems      ─┘
```

Same structure. More steps between input and output, each one preserving something the spider chart discarded. The sequence below walks through each step — read it to understand the logic, then modify it to suit your poet. The Python notebook implements this chain; the code is there when you need it.

---

## A Bank of Operations

Every step in a chain is one of a small number of atomic operations. This is not a full list of operations-- feel free to invent some yourself. But we wanted to provide a few examples to give you a starting point. These combine in any order, any number of times. The diagram section below shows a few configurations. The interesting design question is which sequence suits your poet and your goal.

| Operation | What it does | Example instruction |
|---|---|---|
| **Score** | Assign numerical values across defined traits | *"Score each trait 1–10, return JSON with one-sentence reasoning"* |
| **Extract** | Pull specific elements from text | *"List the 5 phrases most distinctive of this voice"* |
| **Annotate** | You add a judgment or reason — no model call | *(you write this)* |
| **Summarize** | Compress multiple inputs into a shorter form | *"Write a 50-word portrait of this poet's emotional range"* |
| **Generate** | Produce new text from accumulated context | *"Write a verse using only the imagery in this profile"* |
| **Vary** | Produce N alternatives | *"Write three choruses, each with a different formal approach"* |
| **Critique** | Identify weaknesses in a draft | *"What is the single weakest line — the one least like this poet?"* |
| **Judge** | Select the best from N candidates | *"Which of these drafts best captures the voice? Explain."* |
| **Rewrite** | Revise against a constraint | *"Rewrite with no adjectives"* — though see below for who does this |
| **Route** | Decide what happens next | *"Does this need revision? Answer YES or NO."* |

---

## The Basic Chain, Step by Step

### Score

```
SCORE:
  input  → poem text, your trait list
  ask    → "score each trait 1–10, return JSON with one-sentence reasoning"
  output → scores{}
```

This is the spider chart step — the same operation the web tool performs. Run it for each poem in your pool (aim for 3+). At the end, average the scores across all poems. These averaged values are your baseline and your comparison target.

---

### Extract

```
EXTRACT:
  input  → poem text
  ask    → "list 5 phrases or lines that feel most distinctively like this poet"
  output → candidate_phrases[]
```

This is the step the spider chart skips. Where scoring compresses a poem into numbers, extraction keeps the actual language — the specific images, syntactic habits, and turns of phrase that make a voice feel like itself. Run this for each poem alongside the scoring step. You may decide the LLM is good at making these choices, or you may decide you want to make choices like this yourself-- which gets to the next step.

---

### Annotate

```
ANNOTATE (you — no model call):
  from candidate_phrases[], pick the ones that feel right to you
  for each: write one sentence — WHY this line, in your own words
  output → annotated_quotes[]
```

This step has no API call. It's you reading, selecting, and making a judgment. It's also the step that the model cannot do — it can surface candidate phrases, but it cannot tell you which ones matter and why. That act of selection and annotation is close reading. The annotated quotes you build here become the most important input to your generation step.

---

### Build Your Context Object

```
BUILD CONTEXT:
  input  → annotated_quotes[], averaged scores, anything else you choose
  ask    → [optional: ask model to compress; or pass your annotations directly]
  output → context_block
```

The Python notebook calls this `poet_profile` — a 150-word prose description the model synthesizes from texture analyses. It's one approach. It is also, to be direct, the lazier one: you handed the synthesis back to the model, which will treat it approximately the way it treats the numerical scores: as abstracted description rather than specific language.

More generative alternatives for what `context_block` can be:

- Your annotated quotes as-is, passed directly
- A list of 10 poetic images — verbal figures, not picture files — the model is **allowed to use** (and no others)
- Constraints you wrote yourself: *"end every stanza with a question," "no adjectives in the chorus"*
- The raw poem text with no synthesis at all
- Multiple variables, each feeding into the generation step for a different reason

Whatever you build, it must appear in the generation call. If it doesn't, it isn't doing work.

---

### Generate

```
GENERATE:
  input  → context_block, averaged scores
  ask    → "write a verse, chorus, and bridge in this style;
            do not copy lines — write something new that sounds like it
            comes from the same place"
  output → first_draft
```

This is where everything you've built pays off. The more specific and human-authored your context block, the more specific the output will be. A model-written prose description will produce a different result than your own annotated list of lines and reasons — and the comparison between those two will tell you something useful about what "voice" actually consists of.

---

### Compare

```
COMPARE:
  GENERATE (scores only):
    input  → averaged scores, nothing else
    ask    → "write a love song with these trait scores"
    output → scores_only_draft

  read both outputs side by side:
  → which uses more concrete imagery?
  → which sounds more like your poet?
  → what, specifically, did the chain add?
  → which steps mattered most — and how do you know?
```

The differences between these two are the point of this exercise. Not "the chain is better" (though it probably is) — but *why*, specifically. Which step added what? What did your annotated quotes contribute that numerical scores couldn't?

---

### Judge

```
JUDGE:
  input  → first_draft, your annotated_quotes[]
  ask    → "what is the weakest line — the one that sounds
            least like this poet? quote it, then explain why"
  output → critique
```

The judge step is another place to practice putting your metacognition into words. You can also run it across multiple drafts: generate three versions and ask the model to select the strongest, with explanation. What you do with the critique is the next step.

---

### Rewrite

```
REWRITE (you — not the model):
  read   → critique + your original poems
  decide → what to put in place of the weak line, and why
  output → revised_draft
```

Up to you to decide whether the model does this or you do. The model can identify a weak line; but it may not be good at deciding what should replace it.

---

## Going Further: Other Chain Configurations

These are not exotic patterns. Every one of them is built from the same operations in the table above — assembled differently.

```
LINEAR (what the notebook implements)
────────────────────────────────────────────────────────────────────────
Poems ──▶ [Score] ──▶ [Extract] ──▶ [Annotate] ──▶ [Build Context] ──▶ [Generate] ──▶ Draft


GENERATE MULTIPLE, THEN JUDGE
────────────────────────────────────────────────────────────────────────
                                            ┌──▶ Draft A ───┐
Poems ──▶ [Score] ──▶ [Build Context] ──────┼──▶ Draft B ───┼──▶ [Judge] ──▶ Best
                                            └──▶ Draft C ───┘


ITERATIVE REFINEMENT (feedback loop)
────────────────────────────────────────────────────────────────────────
Poems ──▶ [Build Context] ──▶ [Generate] ──▶ [Critique] ──┐
                                   ▲                       │
                                   └──── you Rewrite ──────┘
                                         (repeat 2–3×)


PARALLEL EXTRACTION TRACKS
────────────────────────────────────────────────────────────────────────
          ┌──▶ [Extract: imagery & metaphor]     ──┐
Poem ────▶│                                        ├──▶ [Build Context] ──▶ [Generate]
          └──▶ [Extract: sound, rhythm, syntax] ───┘


BRANCHING BY FORM
────────────────────────────────────────────────────────────────────────
                                       ┌──▶ [Generate: ballad]      ──▶ Track 1
Poems ──▶ [Build Context] ─────────────┼──▶ [Generate: spoken word] ──▶ Track 2
                                       └──▶ [Generate: duet]         ──▶ Track 3
```

The notebook implements the linear chain. Your assignment is to treat it as a starting point. Every pattern above is five to fifteen lines of code built from the same API call you already have — and there are more combinations than any diagram can show. You get to build with language; the only real constraints are what code can do and what a language model can do well. Within those limits, go further than the diagram.

---

## Be Creative

As long as your chain combines operations and you can articulate what each step contributed — there is no wrong answer here. 

---
