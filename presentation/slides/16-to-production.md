# Slide 16 — Dev today, prod tomorrow

## On screen
A table: Concern · Demo today · Production swap-in. Rows: vector store (in-memory → pgvector), models — chat + embed (OpenAI gpt-4o-mini + text-embedding-3-small → on-prem Ollama `llama3.2:3b` + `nomic-embed-text`, or Azure OpenAI), deployment (`mvn quarkus:dev` → JAR + APM agent), documents (6 newsletter PDFs → real corpus, re-ingested on a schedule), cost shape (pennies → scales ~linearly with tokens, infra flat). Caption: *every right-hand cell is a dependency or a property — not an architectural change.*

## Background
This de-risks the obvious objection: "sure, it demos, but productionising AI is a project." Here, each row is a swap, not a redesign — the architecture from slide 8 is unchanged.

The two rows that matter most to this audience:
- **Vector store → pgvector.** The production vector store is just **PostgreSQL** with the pgvector extension — a database they already run, back up, monitor, and understand. No new database vendor, no Pinecone contract. (Milvus/Weaviate/etc. exist if they want a dedicated vector DB, but Postgres is the "no new vendor" answer.) In LangChain4j terms, swap the in-memory store for the pgvector store extension and point it at a datasource.
- **Models → on-prem Ollama.** Because the provider is config, the entire thing can run on models hosted **inside the building** with Ollama (or vLLM). The concrete, demo-tested stack is **`llama3.2:3b`** for chat and **`nomic-embed-text`** for embeddings — both benchmarked CPU-only on the presenting laptop and fluent for a live demo. Switching from OpenAI to local is literally `-Dquarkus.profile=ollama`, not a code change (see `langchain4j-quarkus-example-1/OLLAMA.md`). This is the answer to every security/compliance question: with on-prem inference, **no prompt and no retrieved document ever leaves your network** — and it's also your offline fallback if the Wi-Fi or the hosted API dies on stage.

**Deployment** is the slide-7 story restated: a normal JAR with the Elastic APM agent, on the servers they already run. No containers required (though containers are fine if they want them).

**Cost shape** is the honest economics: the variable cost is LLM tokens, which scales roughly linearly with usage; the *infrastructure* footprint stays flat (one app + a Postgres table). With on-prem Ollama, even the token cost becomes fixed hardware. Contrast with a managed RAG service where convenience is priced per query and choices are constrained.

Close on the sentence that gets this into production: **your DevOps team keeps their runbook.**

## What to say
"Let's kill the obvious objection: 'productionising AI is a whole project.' Look at the right-hand column — every cell is a dependency or a property, not an architectural change.
Two that matter: the production vector store is just Postgres with pgvector — a database you already run and back up. And because the provider is config, you can point this at on-prem Ollama, so no prompt and no document ever leaves your network. That's your security answer.
Deployment is a JAR with the APM agent on the servers you already have. The LLM tokens are the variable cost and they scale with usage; your infrastructure stays flat. The headline: your DevOps team keeps their runbook."

## If asked
- *"Is pgvector fast enough?"* — For most enterprise corpora (thousands to low-millions of chunks), yes, especially with an index. Reach for a dedicated vector DB only at large scale or high QPS.
- *"How good are local models?"* — Good enough for many internal Q&A use cases, and improving fast. Start hosted to prove value, move to Ollama where data sensitivity demands it.
- *"How do documents stay fresh?"* — Re-ingest on a schedule (or on document change). Ingestion is the batch step from slide 5; it doesn't touch the request path.

## Time
~1.5 minutes. Hit pgvector and Ollama hardest — they answer the budget and security questions in one slide.
