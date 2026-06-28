# Demo Plan — "RAG, Four Ways" (Quarkus + LangChain4j)

## Audience
Enterprise Java devs (JEE/Spring background), skeptical of AI hype, conservative DevOps
(no containers, Elastic APM on JVM is the observability story).

## One-sentence goal
Show that RAG isn't one technique — it's a spectrum from "wire it by hand" to
"declare it in config" to "tune it when the naive version gives bad answers" —
and that all of it runs on the same JVM stack they already operate today.

## Corpus
Internal company newsletters ("The Chronicles", `src/main/resources/rag/`) — chosen
deliberately because a generic LLM has *zero* way to know what's in them. Any
hallucination in the "no RAG" baseline will be obviously, demonstrably wrong, which
sells the contrast harder than a generic handbook would.

## What the audience should walk away understanding
1. RAG is not magic — it's retrieval + prompt injection, and you can build the naive
   version yourself in ~20 lines.
2. The Quarkus ecosystem has moved fast since the 0.18-era tutorial: what used to be
   manual wiring (`EmbeddingStoreContentRetriever` + `DefaultRetrievalAugmentor`,
   a separate `langchain4j-embeddings-bge-small-en-q` dependency) is now a
   config-only extension (`quarkus-langchain4j-easy-rag` + `quarkus-langchain4j-onnx-embeddings`).
2. Naive RAG has a failure mode: vague or oddly-phrased questions retrieve the wrong
   chunks. Query transformation is the first lever you reach for before reaching for
   a bigger model or a reranker.
3. None of this required a container, a managed vector DB, or a new observability
   stack. In-memory store + JVM mode + (mention only) Elastic APM agent is enough
   to ship a first version.

## The four endpoints (the spine of the live demo)

| # | Endpoint | RAG style | What it proves |
|---|----------|-----------|-----------------|
| 1 | `POST /ask/no-rag` | None — raw `ChatModel` call | LLM hallucinates confidently about newsletter-specific facts it cannot know. Sets up the problem. |
| 2 | `POST /ask/naive-rag` | Hand-wired `EmbeddingStoreContentRetriever` + `DefaultRetrievalAugmentor` over an in-memory store, ingested manually at startup | "Here's what RAG actually *is* under the hood" — no framework magic hidden from the audience. |
| 3 | `POST /ask/easy-rag` | `quarkus-langchain4j-easy-rag` extension, config-only ingestion of the same PDFs | "Here's how little code this takes today" — direct contrast with #2, same answer, far less code. |
| 4 | `POST /ask/transformed-rag` | Naive retriever + a query transformer (compressing/expanding the user's question before embedding it) | "Here's the first knob you turn when naive RAG gives a bad answer" — query-time augmentation, no extra paid API/model needed. |

All four endpoints answer the *same* question so the audience can see the answers
side by side (e.g. ask something only in the May 2025 or June 2026 issue).

## Live demo script (target: 8–10 min of the 25–30 min talk)
1. Hit `/ask/no-rag` with a newsletter-specific question → visibly wrong/invented answer.
2. Hit `/ask/naive-rag` with the same question → correct answer; briefly show
   `RagIngestion`/`RagRetriever`-equivalent code on screen — this is "RAG in 20 lines."
3. Hit `/ask/easy-rag` with the same question → same correct answer; show the
   `application.properties` config that replaces all that code.
4. Ask a deliberately vague/badly-phrased question against `/ask/naive-rag` → it
   retrieves the wrong chunk or returns nothing useful. Then hit
   `/ask/transformed-rag` with the same vague question → it recovers, because the
   query got rewritten before retrieval.
5. (If time and Wi-Fi allow) Quarkus dev-mode hot reload: tweak a prompt template or
   `maxResults`, save, re-curl, instant difference — no restart.

## Explicit non-goals for this demo
- No pgvector / Postgres live setup — in-memory store only, to match the "no new
  infrastructure" pitch. pgvector is mentioned on a slide as the production swap-in,
  not demoed live.
- No reranking step (needs a Cohere API key/cost) — mentioned as "go further" only.
- No agentic tool-calling / bookings flow from the old tutorial — out of scope, this
  talk is about RAG, not agents.
- No native-image build — JVM mode only, so the Elastic APM story stays intact.

## Stack (researched 2026-06-27, see comparison notes)
- Quarkus 3.33.2 (LTS)
- `quarkus-langchain4j` 1.11.2 (was 0.18.0 in the old tutorial — RAG package layout,
  easy-rag, contextual RAG, and reranking extensions are all new since then)
- `quarkus-langchain4j-openai` for both the chat model and the embedding model
  (`text-embedding-3-small`) — replaces the old tutorial's separate
  `langchain4j-embeddings-bge-small-en-q` in-process dependency
- `quarkus-langchain4j-easy-rag` for endpoint #3
- Java 21
