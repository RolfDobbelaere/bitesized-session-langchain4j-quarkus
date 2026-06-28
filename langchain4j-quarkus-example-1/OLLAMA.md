# Running the demo fully local with Ollama

This is the "on-prem / nothing leaves the building" story from slide 16 — the same
four endpoints, but the chat and embedding models run locally via Ollama instead of
OpenAI. No API key, no network calls, no data leaving the laptop.

## TL;DR — what to use
| Role | Model | Why |
|------|-------|-----|
| **Chat** | **`llama3.2:3b`** | Fastest *good* option on a CPU-only 4-core laptop; no "thinking" mode; concise, fluent answers; great at the one thing RAG needs (answer from supplied context). |
| **Embeddings** | **`nomic-embed-text`** | 274 MB, 768-dim, ~1 s/embed, the standard Ollama embedding model, first-class support in the Quarkus extension. |

Both are already pulled on this machine. Don't use the others you have installed for
the live demo (see "What I rejected" below).

## How to run
```bash
# 1. make sure Ollama is up and the models are warm (see pre-warm note below)
ollama list           # should show llama3.2:3b and nomic-embed-text

# 2. start the app in the ollama profile (no OPENAI_API_KEY needed)
mvn -s public-settings.xml quarkus:dev -Dquarkus.profile=ollama
```
That's it — the `%ollama` profile in `application.properties` flips both the chat and
embedding providers to Ollama. The default profile (no flag) still uses OpenAI, so you
can show *both* and make the "swap the provider in config" point literally true.

## Measured on THIS laptop (i7-1165G7, 4 cores, CPU-only — no usable GPU)
Ollama on Windows only accelerates on NVIDIA/AMD; your Intel Iris Xe is **not** used,
so this is pure CPU inference. Warmed, RAG-shaped prompt (~250-token context):

| Model | Generation | A 2–3 sentence answer | Verdict |
|-------|-----------|------------------------|---------|
| **llama3.2:3b** | **~6.8 tok/s** | **~9 s** | ✅ Use this |
| qwen3:4b (thinking on) | ~5 tok/s | **~100 s** 😱 | ❌ thinking mode explodes output |
| qwen3:4b (thinking off) | ~5 tok/s | ~12 s | ⚠️ slower + needs `/no_think`; not worth it here |
| deepseek-r1:8b | slower | reasons out loud | ❌ wrong tool for a live demo |
| llama3.1:8b | slower | — | ❌ too big for fluent CPU gen |

Note: prompt *processing* is fast once warm (thousands of tok/s) — the cold first
call looked slow only because the model was loading. **Generation speed is the only
thing that matters for perceived fluency**, and that's set by model size.

## Keeping it fluent at ~7 tok/s
At ~7 tokens/sec, output length is your latency dial:
- A 60-token answer (2–3 sentences) ≈ 9 s. Fine.
- A 300-token answer ≈ 45 s. Not fine on stage.

So:
1. **Keep answers short.** The RAG prompts already ask for 2–3 sentences; keep it.
   If you want a hard cap, add `%ollama.quarkus.langchain4j.ollama.chat-model.num-predict=200`.
2. **Pre-warm before you present** so the first on-stage call isn't paying the model
   load cost:
   ```bash
   curl -s http://localhost:11434/api/generate \
     -d '{"model":"llama3.2:3b","prompt":"hi","keep_alive":"30m"}' > /dev/null
   curl -s http://localhost:11434/api/embeddings \
     -d '{"model":"nomic-embed-text","prompt":"warm"}' > /dev/null
   ```
   `keep_alive:30m` keeps it resident in RAM through your talk.
3. **temperature 0** (already set) — deterministic answers, so a rehearsal matches the
   live run.
4. **Close other heavy apps.** On 4 cores, a Teams call or 200 Chrome tabs will visibly
   slow generation.

## What I rejected and why
- **qwen3:4b** — genuinely smarter, but slower per token *and* ships with a verbose
  reasoning mode that turned a 3-sentence answer into 500 tokens / ~100 s. You can
  disable it (`think:false` / `/no_think`), but you're still at ~5 tok/s for no real
  benefit on a RAG task where the context does the heavy lifting.
- **deepseek-r1:8b** (already installed) — a reasoning model; it narrates its thinking,
  which is the opposite of what you want a support-style RAG bot to do on stage.
- **llama3.1:8b** (already installed) — fine model, but 8B on 4 CPU cores is sluggish.
- **Bigger/quantized 7–8B** in general — possible with your 32 GB RAM (RAM is not the
  limit), but CPU generation speed makes them feel laggy live.

## Embedding-dimension note
`nomic-embed-text` is 768-dim vs OpenAI `text-embedding-3-small` at 1536-dim. The
in-memory store used by the demo infers the dimension automatically, so switching
profiles just works. If you later move to **pgvector** (slide 16), set the column
dimension to match whichever embedder is active (768 for nomic), and re-ingest after
switching — vectors from different embedding models are not comparable.
```properties
# only relevant once you add the pgvector extension:
# quarkus.langchain4j.pgvector.dimension=768
```

## Gotchas (same machine as the rest of the demo)
- Same Netty-loopback / VPN startup issue and the easy-rag Docker dev-card apply here —
  see `JUNIOR_DEV_STARTUP.md`. Ollama itself is unrelated to those.
- If a call ever times out, it's almost always the model cold-loading or another app
  hogging the CPU — pre-warm (above) fixes it.
