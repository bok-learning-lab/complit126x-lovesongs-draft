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

*Back to the main reading: [Learning Lab Intro to Context Engineering](/reading/learning-lab-intro-to-context-engineering)*
