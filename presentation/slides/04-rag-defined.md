# Slide 4 — RAG, defined

## On screen
Title: **Retrieval-Augmented Generation.** Subtitle: *Look up the relevant facts first. Then let the model write the answer using them.*
Left: the **open-book exam** analogy. Right: the three moving parts — **Retrieve · Augment · Generate.**

## Background
RAG is an acronym that names its own pipeline, which is handy:
- **Retrieve** — given the question, find the most relevant pieces of your documents.
- **Augment** — add those pieces to the prompt (this is literally string assembly: question + retrieved context + instructions).
- **Generate** — the model answers, now conditioned on supplied facts rather than its parametric memory.

The single most important conceptual point: **the model does not change.** No fine-tuning, no retraining, no GPUs. You're changing the *prompt* the model receives at question time. That reframing is what makes RAG approachable for a non-ML team and cheap to operate.

The open-book-exam analogy is the one people remember: a closed-book exam rewards confident bluffing; an open-book exam rewards finding the right page and quoting it. RAG turns the model's task from "recall" into "reading comprehension," which is the thing LLMs are genuinely good at.

Why retrieval is by *meaning*, not keywords — set this up here, pay it off on slide 5: documents and questions are turned into vectors (embeddings), and similar meanings land near each other, so "time off" can retrieve a passage about "holiday policy" even with no shared words.

## What to say
"RAG — Retrieval-Augmented Generation — is three steps that spell their own name. Retrieve the relevant facts, augment the prompt with them, and let the model generate the answer from them.
The analogy I'd hold onto: a closed-book exam rewards confident guessing. An open-book exam rewards finding the right page. RAG hands the model the page before it starts writing.
And notice what we did *not* do: we didn't retrain anything. Same model, same weights. We just changed what we put in front of it. That's why this is an integration job, not a data-science project."

## If asked
- *"Where do the documents live?"* — In an embedding store (a vector store). In-memory for the demo; Postgres+pgvector or similar in production (slide 16).
- *"How much context can you inject?"* — Bounded by the model's context window and your `maxResults`/chunk size. You retrieve the top-k chunks, not the whole corpus — that's the point of retrieval.

## Time
~1.5 minutes. Lead with the analogy, then name R-A-G so slide 5's pipeline feels inevitable.
