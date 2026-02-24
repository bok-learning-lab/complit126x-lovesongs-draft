---
title: "Prompt Chaining: A Practical Guide"
nav_title: "Prompt Chaining Guide"
sidebar_position: 2
tags: ["workshop", "prompt chaining", "python", "code"]
description: "A step-by-step guide to building a four-step prompt chain that generates love song lyrics with richer context."
---

# Prompt Chaining: A Practical Guide

*Supplement to "Learning Lab Intro to Context Engineering"*

---

## The Core Idea

A prompt chain is a sequence of API calls where **the output of each call becomes part of the input for the next one**.

You've already used the API to do single-step tasks: send a poem, get back an analysis. Prompt chaining extends this into multiple steps, where each step enriches the context for what follows.

```
Poem → [Step 1: Analyze]  → Scores
Poem → [Step 1: Extract]  → Key phrases & images
             ↓ Save to pool, repeat for 3+ poems
     [Step 2: Synthesize] → Voice profile
     [Step 3: Generate]   → Lyrics (full context)
     [Step 4: Compare]    → Lyrics (scores only)
```

Each arrow is a separate API call doing one focused thing. The final output is better than anything you could get in a single prompt — and comparing Step 3 to Step 4 shows you exactly *why*.

---

## Setup

```python
from openai import OpenAI
import json
import re
import os

# In Google Colab: add OPENAI_API_KEY to the 🔑 Secrets panel
# Locally: set the OPENAI_API_KEY environment variable

try:
    from google.colab import userdata
    api_key = userdata.get('OPENAI_API_KEY')
except (ImportError, Exception):
    api_key = os.environ.get('OPENAI_API_KEY')

client = OpenAI(api_key=api_key)

# Initialize your poem pool — stores analyses across multiple poems
poem_pool = []
```

---

## Step 0: Define Your Traits

Before analyzing anything, decide which dimensions you want to track. These become the axes of your spider chart. Edit the list below for your poet — 4–6 traits works well.

```python
traits = [
    {"name": "Melancholy",     "description": "sadness, longing, or wistfulness"},
    {"name": "Romanticism",    "description": "love, passion, or deep emotional connection"},
    {"name": "Nature Imagery", "description": "the natural world as metaphor, symbol, or setting"},
    {"name": "Mortality",      "description": "death, time passing, or impermanence"},
    {"name": "Optimism",       "description": "hopeful outlook, positive resolution, or uplift"},
]
```

---

## Step 1: Add a Poem → Analyze → Extract → Save

Repeat this block for each poem in your pool (aim for 3+). Paste a poem, run the three sub-steps, then save it to `poem_pool` before moving on.

### Paste your poem

```python
POEM = """
Shall I compare thee to a summer's day?
Thou art more lovely and more temperate...
"""

POEM_TITLE = "Sonnet 18"
POET_NAME  = "William Shakespeare"
```

### Analyze: extract trait scores (the spider chart)

```python
trait_list = "\n".join(f"- {t['name']}: {t['description']}" for t in traits)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": f"""Score this poem on each trait from 1 to 10.
Return as JSON: {{"analysis": [{{"trait": "name", "score": 7, "reasoning": "one sentence"}}]}}

Poem:
\"\"\"{POEM}\"\"\"

Traits:
{trait_list}"""
    }]
)

raw = response.choices[0].message.content
try:
    scores_data = json.loads(raw)
except json.JSONDecodeError:
    match = re.search(r'\{[\s\S]*\}', raw)
    scores_data = json.loads(match.group()) if match else {"analysis": []}

# Display scores
for item in scores_data["analysis"]:
    bar = "█" * int(item["score"]) + "░" * (10 - int(item["score"]))
    print(f"  {item['trait']:<20} {bar}  {item['score']}/10")
    print(f"  → {item['reasoning']}\n")
```

### Extract: poetic texture

This is the step the spider chart skips — asking the model to identify the *specific language* that makes this poem feel like itself.

```python
texture_response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": f"""Read this poem carefully and extract its poetic texture.

1. **Characteristic phrases**: Quote 3–5 specific lines most distinctive of this voice.
2. **Formal moves**: How does it open? What turn does it take? How does it close?
3. **Emotional arc**: What feeling does it begin in, and where does it arrive?
4. **Sound and rhythm**: Any recurring sounds, rhythmic patterns, or structural habits?

Be specific. Quote the actual text.

Poem:
\"\"\"{POEM}\"\"\""""
    }]
)

texture = texture_response.choices[0].message.content
print(texture)
```

### Save to pool

```python
poem_pool.append({
    "title":   POEM_TITLE,
    "poet":    POET_NAME,
    "poem":    POEM,
    "scores":  scores_data["analysis"],
    "texture": texture,
})

print(f"✓ Saved '{POEM_TITLE}' — pool has {len(poem_pool)} poem(s)")
```

Go back to **Paste your poem** and repeat for each poem. Once you have 3+, continue to Step 2.

---

## Step 2: Synthesize a Voice Profile

Average the scores across your pool, then ask the model to synthesize a voice profile from all the texture analyses.

```python
# Average scores
trait_totals = {}
for entry in poem_pool:
    for item in entry["scores"]:
        trait_totals.setdefault(item["trait"], []).append(item["score"])

averaged = {t: sum(s) / len(s) for t, s in trait_totals.items()}

# Synthesize voice profile
all_textures = "\n\n---\n\n".join(
    f"From '{e['title']}':\n{e['texture']}" for e in poem_pool
)

synth_response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": f"""I've analyzed {len(poem_pool)} poems by {poem_pool[0]['poet']}.

Here are the texture analyses:

{all_textures}

Write a 150-word voice profile for this poet: their characteristic imagery,
recurring themes, emotional territory, and formal habits.
Be specific — quote actual phrases from the poems where possible."""
    }]
)

voice_profile = synth_response.choices[0].message.content
print(voice_profile)
```

---

## Step 3: Generate Lyrics with Full Context

Now you bring everything — scores, voice profile, and the actual extracted phrases.

```python
score_summary = "\n".join(f"- {t}: {s:.1f}/10" for t, s in averaged.items())

gen_response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": f"""Write a new love song inspired by {poem_pool[0]['poet']}'s style.

--- Emotional qualities (averaged from poem pool, 1–10 scale) ---
{score_summary}

--- Voice profile ---
{voice_profile}

--- Specific texture and phrases from the poems ---
{all_textures}

Write original song lyrics: a verse, a chorus, and a bridge.
Capture this poet's sensibility. Use their characteristic imagery and emotional range.
Do NOT copy their lines — write something new that sounds like it comes from the same place."""
    }]
)

print(gen_response.choices[0].message.content)
```

---

## Step 4: Compare — Scores Only vs. Full Chain

Generate a second version using *only* the averaged scores — no poem text, no texture. This is what the web tool produces.

```python
scores_only_response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": f"""Write a love song with the following trait scores (scale of 1–10):

{score_summary}

Write complete song lyrics with a verse, a chorus, and a bridge."""
    }]
)

print(scores_only_response.choices[0].message.content)
```

Read the two outputs side by side:

- Which uses more concrete imagery?
- Which sounds more like your poet?
- What did the chain add that the scores alone couldn't give?

These observations are the core of your essay.

---

## Things to Experiment With

**Add a revision step.** Send the draft back with specific feedback: *"The chorus is too abstract — revise with a concrete image from the poems."* Iterative refinement is itself a kind of chaining.

**Change what you extract in Step 1.** Try asking for meter and rhyme scheme, sentence grammar, or the ratio of abstract to concrete language. Each lens gives the generator different raw material.

**Pass in the full poem text.** In Step 3, include the actual poems alongside the texture analysis. Does the output improve? Does it start copying too directly?

**Generate multiple songs.** For your album, run Step 3 several times with different instructions: *"Write a ballad"* / *"Write in second person"* / *"Write as if performed on a contemporary stage."*

---

## The Chain as "Open Game"

*The preceding sections are practical instruction. This one is supplementary context — it concerns where some of these ideas come to roost in the history of lit crit and how that bears on what you are building.*

### The Moment: 1948–1975

Between roughly 1948 and 1975, a generation of architects, writers, and theorists became absorbed in cybernetics — Norbert Wiener's science of "communication and control in the animal and the machine." The movement was less technocratic than it might appear; at its center was a philosophical question about agency: what does it mean to be a thinking subject within a system that can also think? Cyberneticists, architects, and literary theorists found themselves converging on the same set of problems: the relationship between rules and possibility, between constraint and generativity, between the structure of a system and the range of uses that structure permits.

These questions have not aged out of relevance. In both the 1960s and the present, a new class of general-purpose information machine has arrived and unsettled the existing relationship between human cognition and technical process. The first generation to take the mainframe seriously — [Italo Calvino](https://engelsbergideas.com/notebook/calvino-and-the-machines), Gordon Pask, Vilém Flusser, Christopher Alexander, Yona Friedman, the members of [Oulipo](https://en.wikipedia.org/wiki/Oulipo) — had to develop conceptual frameworks with few predecessors to draw on. Their writing addresses a set of problems that were identified with unusual clarity and remain, for the most part, unresolved.

For a detailed account of how cybernetic thinking shaped experimental design practice in this period, see Pedro Veloso's [*Cybernetic Diagrams: Design Strategies for an Open Game*](https://papers.cumincad.org/data/works/att/ijac201412402.pdf), which is the source of this section's title and traces the line from Pask and Alexander to contemporary computational design tools.

### What Is an Open Game?

[Vilém Flusser](https://en.wikipedia.org/wiki/Vil%C3%A9m_Flusser), a Czech-Brazilian philosopher whose major work appeared between the 1970s and his death in 1991, developed one of the more durable frameworks for thinking about human agency within computational systems. His central argument is that computation, at its limit, tends to reduce humans to what he called *figures in a formal game*: inputs to an apparatus whose rules they consume without authoring, whose possibilities they exhaust without expanding. His prescription is that the appropriate response is not to refuse the apparatus but to learn it thoroughly enough to play within it on one's own terms — to understand the rules well enough to modify them.

Understanding what he means requires his typology of games.

A **closed game** exhausts its possibility space by design. Tic-tac-toe is the standard example: the positions are finite, perfect play is computable, and the outcome at high skill is predetermined. The structure forecloses novelty.

A **zero-sum game** distributes value between players without creating it: whatever one gains, the other loses, and the total remains constant.

An **open game** operates on different principles. Its rules are generative rather than exhaustive — they establish the conditions under which moves can be made, rather than enumerating the moves themselves. The game's interest derives not from its structure but from its use: from what players do within the constraints, and from the ways in which skilled play can modify the game as it proceeds. Flusser's paradigm case is chess, which he describes as structurally trivial (a fixed board, a finite set of legal moves) but functionally inexhaustible, because "its rules are easy, but it is difficult to play chess well." Chess approaches what Flusser calls the *plus-sum game* when players cooperate to produce positions neither could have anticipated individually — when the game becomes a platform for improvisation rather than a contest for a predetermined advantage. In this configuration, complexity is not given by the rules but generated by the contextual actions taken upon them.

The computational apparatus — the API, the language model, the runtime environment — constitutes the closed portion of this system. The open game is the architecture you construct on top of it.

### The Combinatorial Machine

[Italo Calvino](https://en.wikipedia.org/wiki/Italo_Calvino), in his 1967 lecture ["Cybernetics and Ghosts"](https://www.jfki.fu-berlin.de/academics/SummerSchool/Dateien2011/Reading_Assignments/iuli_reader2.pdf) (later collected in *The Uses of Literature*), proposed that literature could be understood as a combinatorial machine: "an assemblage of discrete elements, combined according to logical rules existing outside the author." He read this not as a reduction of literary art but as a clarification of it. Once the mechanical dimension of any generative process is acknowledged, the writer's attention can be redirected toward what the mechanism cannot determine: the choice of rules, the selection of constraints, the decision of when and how to deviate. What the combinatorial machine cannot produce, Calvino argued, is what he called "taboo language" — the move the system's assumptions did not anticipate, the output that destabilizes rather than reinforces the existing order of the game. That is the writer's irreducible contribution.

The same distinction applies here. The four-step chain establishes a set of rules; it does not determine what you do with them. How many steps you add, where you introduce feedback loops, whether you generate multiple alternatives and adjudicate between them, whether you ask the model to evaluate its own output: these are compositional decisions the code cannot make for you. They are, in the terms Christopher Alexander used in his theory of *generating systems*, the difference between the system and the family of objects it produces. A game, a language, a genetic code: each is less interesting as a structure than as a generator of cases. The four-step chain is one case among many, and the design of the chain is where the intellectual work of the assignment actually lies.

Students who replicate the four-step structure without modification are, in Flusser's framing, treating the apparatus as a closed game — following the rules as given rather than playing within them. The point is not complexity for its own sake, but recognition that the architecture of a prompt chain is itself an expressive decision. Every pattern in the diagram below is five to fifteen lines of Python built on the same API calls you have already written.

---

### A Diagram of Possible Chains

```
LINEAR (what you built)
────────────────────────────────────────────────────────────────────────
Poem ──▶ [Analyze] ──▶ [Extract] ──▶ [Synthesize] ──▶ [Generate] ──▶ Draft


GENERATE MULTIPLE, THEN JUDGE
────────────────────────────────────────────────────────────────────────
                                               ┌──▶ Draft A ───┐
Poem ──▶ [Analyze] ──▶ [Extract] ──▶ [Synth] ──┼──▶ Draft B ───┼──▶ [Judge] ──▶ Best
                                               └──▶ Draft C ───┘


ITERATIVE REFINEMENT (feedback loop)
────────────────────────────────────────────────────────────────────────
Poem ──▶ [Analyze] ──▶ [Extract] ──▶ [Synth] ──▶ [Generate] ──▶ [Critique] ──┐
                                                       ▲                       │
                                                       └──── revised prompt ───┘
                                                            (repeat 2–3×)


PARALLEL EXTRACTION TRACKS
────────────────────────────────────────────────────────────────────────
         ┌──▶ [Extract: imagery & metaphor]    ──┐
Poem ───▶│                                       ├──▶ [Synthesize] ──▶ [Generate]
         └──▶ [Extract: sound, rhythm, syntax] ──┘


BRANCHING BY FORM
────────────────────────────────────────────────────────────────────────
                                    ┌──▶ [Generate: ballad]      ──▶ Track 1
Poem ──▶ [Analyze] ──▶ [Synth] ─────┼──▶ [Generate: spoken word] ──▶ Track 2
                                    └──▶ [Generate: duet]         ──▶ Track 3
```

These are not exotic patterns. They are Rube Goldberg machines assembled from the same five-line API call you already know how to make.

---

### A Bank of Mechanics

Every step in a prompt chain is one of a handful of atomic operations. They can be combined in any order (this is NOT event close to a full list, let alone a canon one-- just popping some in here for inspiration). 

| Mechanic | What it does | Example instruction |
|---|---|---|
| **Extract** | Pull structured data from text | *"Return the five most distinctive images as a JSON list"* |
| **Summarize** | Compress while preserving signal | *"Write a 50-word portrait of this poet's emotional range"* |
| **Rewrite** | Change register, voice, or constraint | *"Rewrite this draft as if performed at a funeral"* |
| **Generate** | Produce new text from context | *"Write a verse using only the imagery in this profile"* |
| **Vary** | Produce N alternatives | *"Write three different choruses, each formally distinct"* |
| **Score** | Assign numerical values | *"Rate this draft on specificity (1–10) and emotional range (1–10)"* |
| **Judge** | Select the best from N candidates | *"Which of these three drafts best captures the poet's voice? Explain."* |
| **Critique** | Generate actionable feedback | *"What is the weakest image here? How would you revise it?"* |
| **Synthesize** | Merge multiple inputs into one | *"Combine these analyses into a single voice profile"* |
| **Route** | Ask the model to decide what happens next | *"Does this draft need revision? Answer YES or NO."* |

The **Route** mechanic warrants particular attention, as it introduces genuine conditional branching: the chain's next step is determined not by the programmer in advance but by the model's evaluation of its own output. This is the feedback loop in the cybernetic sense. [Gordon Pask](https://en.wikipedia.org/wiki/Gordon_Pask), in his design for the [Fun Palace](https://www.mdpi.com/2076-0752/15/1/4), built exactly this kind of structure into his proposal — a cultural center governed by a self-adjusting control system that would read patterns of user behavior and reconfigure the environment in response. Pask located the aesthetic value of the system not in any predetermined configuration but in what emerged from the recursive exchange between the environment and its occupants. A prompt chain with a Route step operates on the same principle: the model's evaluation of the current output becomes the condition that determines what happens next. In practice, this means asking the model whether a draft requires further revision before proceeding, and looping back if it does.

#### Judging between multiple drafts

```python
drafts = []
for i in range(3):
    r = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": f"Write a chorus inspired by {poem_pool[0]['poet']}.\n\n{voice_profile}\n\nVariation {i+1}: bring a different formal approach each time."}]
    )
    drafts.append(r.choices[0].message.content)

judge_prompt = "Here are three draft choruses:\n\n"
for i, d in enumerate(drafts):
    judge_prompt += f"--- Draft {i+1} ---\n{d}\n\n"
judge_prompt += f"Which best captures {poem_pool[0]['poet']}'s voice? Explain in 2–3 sentences, then reproduce the best one."

result = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": judge_prompt}]
)
print(result.choices[0].message.content)
```

#### Iterative refinement

```python
draft = gen_response.choices[0].message.content  # from Step 3

for round in range(2):
    critique = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": f"""This is a draft lyric inspired by {poem_pool[0]['poet']}:

\"\"\"{draft}\"\"\"

Identify the single weakest line — the one that sounds most generic, least like this poet.
Then rewrite the entire draft with that line replaced."""}]
    )
    draft = critique.choices[0].message.content
    print(f"--- After revision {round + 1} ---\n{draft}\n")
```

---

### Debugging as Context Engineering

When the chain produces poor output — and at some point it will — the process of diagnosing and correcting it is itself a form of context engineering. Reading the output carefully, identifying what information the prompt failed to supply, revising accordingly: this is not a failure mode distinct from the work; it is the work.

Calvino's combinatorial machine does not dispense with the author; it redefines the author's role as the designer of the rules rather than the producer of any particular output. In practical terms, this means attending to what the model produces and revising the constraints that generated it. When you prompt the model to diagnose a failed step — to identify what a given output lacked and what a better prompt might have specified — you are running a meta-chain in which the failed output serves as context and the model's diagnosis becomes the next instruction. This recursive relationship between output and revision is what Pask called "conversation": a loop in which complexity is produced that neither party could have reached alone.

[Bruno Munari](https://en.wikipedia.org/wiki/Bruno_Munari) proposed, in *[Design as Art](https://en.wikipedia.org/wiki/Design_as_Art)* (1966), that the designer's primary responsibility is not the production of objects but the design of the processes that generate them — processes capable of producing families of related objects, each distinct, none fully specified in advance. A prompt chain is precisely such a process: a structure that determines a range of possible outputs without determining any particular one. The four-step chain in this guide is one configuration within that range. The assignment is to treat it as a starting point rather than a template.

---

*Back to the main reading: [Learning Lab Intro to Context Engineering](/reading/learning-lab-intro-to-context-engineering)*
