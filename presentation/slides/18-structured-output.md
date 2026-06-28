# Slide 18 — Beyond RAG: structured output (POJO)

## On screen
Title: **Ask for a POJO, get a POJO.** Left: a `record Game(...)` plus a `GameExpert` AiService whose method returns `GameChart` (not a String). Right: the deserialized JSON result (3 games with name/publisher/metacriticScore/releaseYear) and three bullets — schema injected, deserialized into the record, no ObjectMapper.

## Background
Second "beyond RAG" slide, and a reliable crowd-pleaser. Again **no RAG** — one feature, in isolation.

How it works:
- Declare the shape you want as plain Java **records**: `Game(name, publisher, metacriticScore, releaseYear)` and a wrapper `GameChart(genre, List<Game>)`.
- Make the AiService method **return that type** instead of `String`.
- quarkus-langchain4j generates a **JSON schema** from the record and adds it to the request (with OpenAI it uses structured-output / JSON mode; with Ollama it sets `format=json`), then **deserializes the model's reply straight into your POJO**. You never touch an `ObjectMapper`, never write a parser, never "extract the JSON from the prose."
- The `@UserMessage` is a template: `{count}` and `{genre}` are filled from the method parameters (works because the build uses `-parameters`).

Why this matters beyond a demo: structured output is how you make an LLM a *component* in a real system — extracting fields from a document, producing tool-call arguments, filling a form, classifying into an enum. The typed return is the boundary that keeps the model's fuzziness from leaking into the rest of your code.

Honesty note (say it if demoing on Ollama): `gpt-4o-mini` is rock-solid at this. Small local models (`llama3.2:3b`) usually comply but can occasionally emit slightly off JSON; if it wobbles, re-run or use the OpenAI profile for this endpoint.

Like slide 17, it opts out of easy-rag's default augmentor (`retrievalAugmentor = NoRagAugmentorSupplier.class`) so no newsletter retrieval is involved — the structured-output feature stands alone.

## What to say
"Second one, and this is the one I'd actually build features on. I want the three best open-world RPGs — not as a paragraph I have to parse, but as objects. So I declare a Java record for the shape, and I make the method return it.
Quarkus turns that record into a JSON schema, tells the model 'answer in exactly this shape', and hands me back a populated POJO. No ObjectMapper, no fishing JSON out of prose. This is how the model stops being a chat toy and becomes a component — extraction, tool arguments, form-filling, all of it."

## Live demo (optional) — Bruno folder "6 - Structured output"
- `6.1` POST /games {"genre":"open-world RPG"} → typed JSON of 3 games.
- `6.2` POST /games {"genre":"indie platformer","count":5} → shows the template params.

## If asked
- *"Does it always produce valid JSON?"* — With schema/JSON mode on capable models, effectively yes; tiny local models can occasionally slip. Validate/retry in production.
- *"Lists and nested objects?"* — Yes — `GameChart` wraps a `List<Game>`; nesting works.
- *"Can I use this for tool calling?"* — Same machinery underpins structured arguments; it's the foundation for that.

## Time
~1.5 minutes. Then move to the close.
