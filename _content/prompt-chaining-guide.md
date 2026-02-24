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

## There Is No Template

A prompt chain is a sequence of calls where the output of one step becomes part of the input for the next. That's the whole definition. What those steps do, in what order, how many there are, whether they loop — none of that is fixed.

**There is no canonical chain for this assignment.** The sequence in the Python notebook is one starting point — a reasonable skeleton that you are expected to modify, extend, or replace entirely. The only real constraints are what code can do and what language models can actually do well. Within those limits, you are free.

There is almost no way to do this wrong. As long as you are combining operations and the work of *reading* your poet is genuinely yours, your chain is doing what it's supposed to do. If your chain produces something that surprises you — an output you couldn't have gotten from the web tool on the first page — it's working.

---

## The Operations

Every step in a chain is one of a small number of atomic operations. **A chain is a sequence of them.** They combine in any order, any number of times.

| Operation | What it does | Example instruction |
|---|---|---|
| **Score** | Assign numerical values across defined traits | *"Score each trait 1–10, return JSON with one-sentence reasoning"* |
| **Extract** | Pull specific elements from text | *"List the 5 phrases that feel most distinctively like this poet"* |
| **Annotate** | You add a judgment or reason to something extracted | *(no model call — you write this)* |
| **Summarize** | Compress multiple inputs into a shorter form | *"Write a 50-word description of this poet's emotional range"* |
| **Generate** | Produce new text from accumulated context | *"Write a verse using only the imagery in this profile"* |
| **Vary** | Produce N alternatives | *"Write three choruses, each with a different formal approach"* |
| **Critique** | Identify weaknesses in a draft | *"What is the weakest line — the one that sounds least like this poet?"* |
| **Judge** | Select the best from N candidates | *"Which of these three drafts best captures the voice? Explain."* |
| **Rewrite** | Revise a draft against a constraint | *"Rewrite with no adjectives"* — though see below for who does this |
| **Route** | Decide what happens next | *"Does this draft need revision? Answer YES or NO."* |

The **Annotate** step is always done by you. So is **Rewrite** — at least once.

---

## A Starting Point (Pseudocode)

The Python notebook implements this sequence. It's a starting point, not an answer. Read it as a structure, not a recipe.

```
FOR EACH poem in your pool (aim for 3+):

  SCORE:
    input  → poem text, your trait list
    ask    → "score each trait 1–10, return JSON with one-sentence reasoning"
    output → scores{}

  EXTRACT:
    input  → poem text
    ask    → "list 5 phrases or lines that feel most distinctively like this poet"
    output → candidate phrases[]

  ANNOTATE (you — not the model):
    from candidate phrases, pick the ones that feel right
    for each: write one sentence — WHY this line, in your own words
    output → annotated_quotes[]


AVERAGE scores across your pool:
  compute → averaged trait values


BUILD YOUR CONTEXT OBJECT:
  input  → annotated_quotes[], averaged scores, anything else you choose
  output → context_block (a string — see next section for what this can be)


GENERATE:
  input  → context_block
  ask    → "write a verse, chorus, and bridge in this style"
  output → first_draft


JUDGE:
  input  → first_draft, your annotated_quotes[]
  ask    → "what is the weakest line — the one that sounds least like this poet?"
  output → critique


REWRITE (you — not the model):
  read   → critique + your original poems
  decide → what to put in place of the weak line, and why
  output → revised_draft


COMPARE (required — this is the core of your essay):
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

---

## On Building Context

The notebook uses a variable called `poet_profile` — a 150-word prose description the model synthesizes from texture analyses. It works. It is also the lazy version: you asked the model to decide what matters.

The `poet_profile` is numbers-but-with-words. It compresses your close reading into a generic paragraph the model will treat approximately the same way it treats the scores. The more interesting move is to build context that reflects your actual judgment about this poet.

Some alternatives — any of these can be your "context object":

- Lines you selected and typed yourself, with your own brief reason for each
- A list of 10 images the model is **allowed** to use (and no others)
- Constraints you wrote: *"end every stanza with a question," "no adjectives in the chorus," "always address the subject as 'you'"*
- The raw poem text pasted directly — no synthesis, no compression
- Multiple separate variables that each feed into the generation step for a different reason
- A JSON object with whatever fields you decide are meaningful

The only requirement: whatever you build must actually appear in a later step's prompt. If your context object isn't in the generation call, it isn't doing work.

---

## Designing Your Own Sequence

Once you've run the starting chain, redesign it. Some directions:

| Goal | Sequence |
|---|---|
| Explore different forms for your album | Generate × 3 (ballad / spoken word / second person) → Judge |
| Raise the floor through iteration | Generate → Critique → you Rewrite → Generate again (2–3 loops) |
| Separate what you extract | Extract: imagery → Extract: sound and syntax → both into Generate |
| Skip model synthesis entirely | Annotate (you write the context) → Generate |
| Force a formal constraint | Rewrite [constraint: no adjectives] → Rewrite [constraint: second person] |
| Branch on whether it's working | Generate → Score → if score < 7: loop back to Rewrite |
| Let drafts compete | Generate × 3 → Judge → you pick the winner and explain why |

The question worth asking about each step: *what does this step provide that the previous step couldn't?* If a step's output isn't needed by anything downstream, it's not doing work.

---

## The Comparison Step Is Your Essay

The assignment started with the web tool: paste poems, get scores, generate lyrics from numbers alone. Your chain should end with a return to that baseline — generate a second version using *only* the averaged scores, no poem text, no annotations, nothing else.

Read the two outputs side by side. The differences between them are your essay. Not "the chain is better" (though it probably is) — but *why*, specifically. Which step added what? What did your annotated quotes contribute that the model's extracted phrases couldn't? What did your rewrite change that the model's critique identified but couldn't fix?

The comparison is evidence. The essay is the argument you build from it.

---

## The Judge and Rewrite Steps Are Required

Every submission should include at least one **Judge** step and at least one moment where **you** make a revision.

The Judge step: pass two or more drafts (or a draft against your annotated quotes from the poems) and ask the model to identify what's weakest, most generic, or least characteristic of this poet.

The Rewrite step: take the critique, return to the poems, and revise the line yourself. Do not ask the model to rewrite its own critique — that's just asking it to self-evaluate, which is not the same thing. The act of choosing what to replace a weak line with, drawing on your actual reading, is what the assignment is testing. That move has to come from you.

---

## Almost Nothing Is Wrong

The one failure mode is treating the notebook as a template and adding two steps under duress.

Your chain does not need to look like anyone else's. It does not need to follow the order in the pseudocode above. It does not need a `poet_profile` or a texture extraction step or even a synthesis step at all. What it needs is for the **Annotate** and **Rewrite** steps to be genuinely yours — evidence that you read the poems, made judgments, and brought those judgments into the chain.

If you do that, there's almost no way to get this wrong.

---

*The Python code for all of this is in the [notebook](/reading/next-steps). For the intellectual history — Calvino, Flusser, Pask — see the [appendix](/reading/appendix-open-game).*

*Back to: [Learning Lab Intro to Context Engineering](/reading/learning-lab-intro-to-context-engineering)*
