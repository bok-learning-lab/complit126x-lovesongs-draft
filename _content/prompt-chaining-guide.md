---
title: "Prompt Chaining: A Practical Guide"
nav_title: "Prompt Chaining Guide"
sidebar_position: 2
tags: ["workshop", "prompt chaining", "python", "code"]
description: "A step-by-step guide to building a prompt chain that generates love song lyrics with richer context than scores alone."
---

# Prompt Chaining: A Practical Guide

*Supplement to "Learning Lab Intro to Context Engineering"*

---

## The Core Idea

A prompt chain is a sequence of API calls where **the output of each call becomes part of the input for the next one**.

You've already used the API for single-step tasks: send a poem, get back an analysis. Chaining extends this — each step enriches the context for what follows.

```
Poem → [Score]    → trait values
Poem → [Extract]  → specific phrases and images
             ↓ repeat for 3+ poems
     [Synthesize] → shared context
     [Generate]   → lyrics (full context)
     [Compare]    → lyrics (scores only)
```

Each arrow is a separate API call doing one focused thing. The final output is better than anything a single prompt can produce — and comparing the last two steps shows you exactly why.

---

## Setup

```python
from openai import OpenAI
import json, re, os

try:
    from google.colab import userdata
    api_key = userdata.get('OPENAI_API_KEY')
except (ImportError, Exception):
    api_key = os.environ.get('OPENAI_API_KEY')

client = OpenAI(api_key=api_key)
poem_pool = []
```

---

## Step 0: Define Your Traits

Decide which dimensions to track. Edit the list for your poet — 4–6 traits works well. Use the same list for every poem.

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

## Step 1: Add a Poem → Score → Extract → Save

Repeat this block for each poem in your pool (aim for 3+).

### Paste your poem

```python
POEM = """
Shall I compare thee to a summer's day?
Thou art more lovely and more temperate...
"""

POEM_TITLE = "Sonnet 18"
POET_NAME  = "William Shakespeare"
```

### Score it

```python
trait_list = "\n".join(f"- {t['name']}: {t['description']}" for t in traits)

prompt = f"""Score this poem on each trait from 1 to 10.
Return as JSON: {{"analysis": [{{"trait": "name", "score": 7, "reasoning": "one sentence"}}]}}

Poem:
\"\"\"{POEM}\"\"\"

Traits:
{trait_list}"""

response = client.responses.create(model="gpt-4o", input=prompt)

# Strip markdown code fences if the model wraps the JSON
raw = re.sub(r'^```\w*\n?|\n?```$', '', response.output_text.strip())
scores_data = json.loads(raw)

for item in scores_data["analysis"]:
    bar = "█" * item["score"] + "░" * (10 - item["score"])
    print(f"  {item['trait']:<20} {bar}  {item['score']}/10  — {item['reasoning']}")
```

### Extract its texture

This is the step the spider chart skips — asking the model to identify the *specific language* that makes this poem feel like itself.

```python
prompt = f"""Read this poem and extract its poetic texture.

1. Characteristic phrases: Quote 3–5 specific lines most distinctive of this voice.
2. Formal moves: How does it open? What turn does it take? How does it close?
3. Emotional arc: What feeling does it begin in, and where does it arrive?
4. Sound and rhythm: Any recurring sounds, rhythmic patterns, or structural habits?

Be specific. Quote the actual text.

Poem:
\"\"\"{POEM}\"\"\""""

texture_response = client.responses.create(model="gpt-4o", input=prompt)
texture = texture_response.output_text
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

print(f"Saved '{POEM_TITLE}' — pool has {len(poem_pool)} poem(s)")
```

Go back to **Paste your poem** and repeat. Once you have 3+, continue below.

---

## Step 2: Build Shared Context

Average the scores across your pool and synthesize a single description of the poet's voice from all the texture analyses.

The variable here is called `poet_profile` — but it's just a named chunk of text you're going to reuse downstream. You could build it differently: a list of images, a set of rules, a description of the meter. This particular version asks for a 150-word prose description, which works well as a generation prompt. Yours can be whatever you think will be most useful.

```python
# Average scores
trait_totals = {}
for entry in poem_pool:
    for item in entry["scores"]:
        trait_totals.setdefault(item["trait"], []).append(item["score"])

averaged = {t: sum(s) / len(s) for t, s in trait_totals.items()}

# Collect all texture analyses
all_textures = "\n\n---\n\n".join(
    f"From '{e['title']}':\n{e['texture']}" for e in poem_pool
)

# Build the shared context
prompt = f"""I've analyzed {len(poem_pool)} poems by {poem_pool[0]['poet']}.

Here are the texture analyses:

{all_textures}

Write a 150-word profile of this poet's voice: characteristic imagery, recurring themes,
emotional territory, and formal habits. Quote actual phrases from the poems."""

synth_response = client.responses.create(model="gpt-4o", input=prompt)
poet_profile = synth_response.output_text
print(poet_profile)
```

---

## Step 3: Generate Lyrics with Full Context

Now you pass everything — averaged scores, the poet profile, and the raw texture — into the generation step.

```python
score_summary = "\n".join(f"- {t}: {s:.1f}/10" for t, s in averaged.items())

prompt = f"""Write a new love song inspired by {poem_pool[0]['poet']}'s style.

Emotional profile (averaged across {len(poem_pool)} poems, 1–10 scale):
{score_summary}

Poet's voice:
{poet_profile}

Texture and phrases from the poems:
{all_textures}

Write original song lyrics: a verse, a chorus, and a bridge.
Do NOT copy lines from the poems — write something new that sounds like it comes from the same place."""

gen_response = client.responses.create(model="gpt-4o", input=prompt)
lyrics_full = gen_response.output_text
print(lyrics_full)
```

---

## Step 4: Compare — Scores Only vs. Full Chain

Generate a second version using *only* the averaged scores — nothing else. This is what the web tool produces.

```python
prompt = f"""Write a love song with these trait scores (1–10 scale):

{score_summary}

Write complete song lyrics: a verse, a chorus, and a bridge."""

scores_only_response = client.responses.create(model="gpt-4o", input=prompt)
print(scores_only_response.output_text)
```

Read the two outputs side by side:

- Which uses more concrete imagery?
- Which sounds more like your poet?
- What exactly did the chain add that the scores couldn't?

These observations are the core of your essay.

---

## Designing Your Chain

The four-step chain above is one configuration — not the canonical one. Think of building a chain like writing an outline: you pick the moves you need, in the order you need them.

The mechanics below are the vocabulary. **A chain is a sequence of them.** The interesting design question is which sequence suits your poet and your goal.

Some example sequences:

| Goal | Sequence |
|---|---|
| Get one solid draft | Extract → Summarize → Generate |
| Pick the best of several approaches | Extract → Generate × 3 → Judge |
| Refine until it sounds right | Extract → Generate → Critique → Rewrite (repeat) |
| Explore different forms | Extract → Summarize → Generate × 3 (ballad / spoken word / duet) |
| Accumulate context across many poems | Extract × 5 → Synthesize → Generate |
| Route on quality | Extract → Generate → Score → if score < 7: Rewrite |

There's no formula. **What matters is that each step hands the next one something it couldn't produce alone.** If a step's output isn't used by any later step, it's not doing work.

### A bank of mechanics

Every step is one of a small set of atomic operations. Combine them in any order:

| Mechanic | What it does | Example instruction |
|---|---|---|
| **Extract** | Pull structured data from text | *"Return the five most distinctive images as a list"* |
| **Summarize** | Compress while preserving signal | *"Write a 50-word portrait of this poet's emotional range"* |
| **Rewrite** | Change register, voice, or constraint | *"Rewrite this draft as if performed at a funeral"* |
| **Generate** | Produce new text from context | *"Write a verse using only the imagery in this profile"* |
| **Vary** | Produce N alternatives | *"Write three different choruses, each formally distinct"* |
| **Score** | Assign numerical values | *"Rate this draft on specificity (1–10) and emotional range (1–10)"* |
| **Judge** | Select the best from N candidates | *"Which of these three drafts best captures the poet's voice? Explain."* |
| **Critique** | Generate actionable feedback | *"What is the weakest image here? How would you revise it?"* |
| **Synthesize** | Merge multiple inputs into one | *"Combine these analyses into a single voice profile"* |
| **Route** | Decide what happens next | *"Does this draft need revision? Answer YES or NO."* |

### Two patterns worth knowing

**Generate multiple, then judge:**

```python
drafts = []
for i in range(3):
    prompt = f"""Write a chorus inspired by {poem_pool[0]['poet']}.

{poet_profile}

Attempt {i+1} — use a different formal approach each time."""
    r = client.responses.create(model="gpt-4o", input=prompt)
    drafts.append(r.output_text)

judge_prompt = "Here are three draft choruses:\n\n"
for i, d in enumerate(drafts):
    judge_prompt += f"--- Draft {i+1} ---\n{d}\n\n"
judge_prompt += f"Which best captures {poem_pool[0]['poet']}'s voice? Explain briefly, then reproduce the best one."

result = client.responses.create(model="gpt-4o", input=judge_prompt)
print(result.output_text)
```

**Iterative refinement:**

```python
draft = lyrics_full  # from Step 3

for round_num in range(2):
    prompt = f"""This is a draft lyric inspired by {poem_pool[0]['poet']}:

\"\"\"{draft}\"\"\"

Identify the single weakest line — the one that sounds most generic, least like this poet.
Then rewrite the full draft with that line replaced."""

    r = client.responses.create(model="gpt-4o", input=prompt)
    draft = r.output_text
    print(f"--- After revision {round_num + 1} ---\n{draft}\n")
```

---

## A Note on Debugging

When the chain produces weak output, the process of diagnosing it is part of the work: read carefully, identify what information the step failed to provide, revise accordingly. You can even run this as an explicit step — ask the model to identify what a given output lacked and what a better prompt would have specified. That's just another link in the chain.

---

*For the intellectual history behind these ideas — Calvino's combinatorial machine, Flusser's open game, Pask's feedback loops — see the [appendix](/reading/appendix-open-game).*

*Back to: [Learning Lab Intro to Context Engineering](/reading/learning-lab-intro-to-context-engineering)*
