---
title: "Prompt Chaining: A Practical Guide"
nav_title: "Prompt Chaining Guide"
sidebar_position: 2
tags: ["workshop", "prompt chaining", "python", "code"]
description: "How to design a prompt chain for this assignment — operations, combinations, and why there's no canonical sequence."
---

# Prompt Chaining: A Practical Guide

*Supplement to "Learning Lab Intro to Context Engineering"*

---

## The Core Idea

A prompt chain is a sequence of calls where **the output of one step becomes part of the input for the next**. Each arrow below is a separate API call doing one focused thing.

```
Poem → [Score]    → trait values
Poem → [Extract]  → specific phrases and images
             ↓ repeat for 3+ poems
     [Synthesize] → shared context
     [Generate]   → lyrics (full context)
     [Compare]    → lyrics (scores only)
```

The basic chain above is a starting point, not a template. The sequence below walks through each step — read it to understand the logic, then modify it to suit your poet. The Python notebook implements this chain exactly; the code is there when you need it.

---

## A Bank of Operations

Every step in a chain is one of a small number of atomic operations. These combine in any order, any number of times. The diagram section below shows a few configurations. The interesting design question is which sequence suits your poet and your goal.

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
- A list of 10 images the model is **allowed to use** (and no others)
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

*The Python code for all of this is in the [notebook](/reading/next-steps). For the intellectual history — Calvino, Flusser, Pask — see the [appendix](/reading/appendix-open-game).*

*Back to: [Learning Lab Intro to Context Engineering](/reading/learning-lab-intro-to-context-engineering)*
