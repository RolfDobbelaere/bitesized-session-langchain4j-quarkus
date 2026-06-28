# Slide 9 — LangChain4j in five lines

## On screen
Code: a `@RegisterAiService` interface with a single `String chat(String)` method, injected like any bean. Right: a checklist of what you did *not* write (HTTP client, JSON plumbing, retries, prompt concatenation) and a note that model config lives in `application.properties`.

## Background
This is the "look how little there is" beat, and it's true: in the Quarkus extension, an AI service is **declarative**. You write an interface and annotate it; Quarkus generates the implementation at build time. Calling the model is then just calling a method on an injected bean.

What the framework absorbs for you:
- the HTTP client to the model API,
- request/response (de)serialisation,
- retry/timeout/error handling,
- and — importantly — keeping prompt assembly out of your business code.

The config-over-code point is the through-line of the whole talk: the API key, model name, temperature, and token limits live in `application.properties`, not in Java. That's what makes "swap OpenAI for on-prem Ollama" a config change. Show that this is the same lock-in argument from slide 6, now made concrete.

Note for honesty: this slide has **no RAG yet** — it's the plain model (the same thing that hallucinated on slide 3). RAG is added by attaching a retrieval augmentor, which is the next three slides.

Current API note (so you're not caught out): the chat-model interface in the current LangChain4j (1.x) is `ChatModel` with a convenience `String chat(String)` method (older tutorials say `ChatLanguageModel` / `generate(...)`). The AiService pattern hides this anyway.

## What to say
"This is the entire integration. An interface, one annotation, one method. Quarkus generates the implementation at build time, and you inject it like any other bean.
Look at what you didn't write: no HTTP client, no JSON plumbing, no retry logic, no prompt strings glued together in your controller. And the model config — key, model name, temperature — lives in properties, not code. That's why swapping providers is a config change.
One catch: there's no RAG on this slide yet. This is the plain model — the same one that made up a Lisbon office. Let's give it the answer key."

## If asked
- *"Where's the prompt / system message?"* — You can add `@SystemMessage` / `@UserMessage` annotations on the interface methods for templating; omitted here to keep the reveal clean.
- *"How is the implementation generated?"* — Build-time bytecode generation by the Quarkus extension; no reflection at runtime, which is part of why startup is fast.
- *"Can one app have several AI services?"* — Yes — that's exactly how the four demo endpoints each get a different RAG configuration.

## Time
~1.5 minutes. The reveal is the smallness — let the checklist land, then pivot to RAG.
