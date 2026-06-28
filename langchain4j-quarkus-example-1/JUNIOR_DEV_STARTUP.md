# Getting started — RAG demo project

This is a small Quarkus app with **four endpoints that answer the same question
using four different RAG strategies**, so you can compare what each one actually
does. Read [DEMO.md](DEMO.md) first — it explains *why* the project is shaped this
way and what each endpoint is meant to prove. This file is just "how do I run it."

## 1. Prerequisites

- Java 21 (`java -version`)
- Maven (`mvn -version`) — a global install is fine, you don't need the wrapper
- An OpenAI API key with some credit on it

## 2. Maven repository quirk (read this before your first build)

Our corporate Maven settings (`~/.m2/settings.xml`) mirror Maven Central through
the internal Artifactory, which doesn't allowlist the `io.quarkus.platform` and
`io.quarkiverse.langchain4j` groups this project needs — and that Artifactory is
only reachable on VPN anyway. Rather than touch your global settings, this project
ships its own override: **[public-settings.xml](public-settings.xml)**, which just
points straight at public Maven Central.

Use `-s public-settings.xml` on every Maven command for this project:

```bash
mvn -s public-settings.xml compile
mvn -s public-settings.xml quarkus:dev
```

If you're back on VPN and prefer the corporate mirror, you can drop the `-s` flag —
the project will resolve through Artifactory at that point too.

## 3. Set your API key

Don't put a real key in `application.properties` — it reads it from an env var:

```bash
# bash
export OPENAI_API_KEY=sk-...

# PowerShell
$env:OPENAI_API_KEY = "sk-..."
```

> A previous tutorial version of this project (`step-08` in the old workshop repo)
> had a real key committed in plaintext in `application.properties`. If you ever
> find a key like that in a repo, treat it as compromised and rotate it — don't
> reuse it.

## 4. Run it

```bash
mvn -s public-settings.xml quarkus:dev
```

This starts the app on `http://localhost:8080` with hot reload — edit a Java file
or `application.properties`, save, and the next request picks up the change with
no restart.

On startup, watch the log for a line like:

```
Ingested 6 newsletter(s) into the naive/transformed in-memory store
```

That's the manual ingestion (`NewsletterStore.java`) parsing the PDFs in
`src/main/resources/rag/` and embedding them. The `easy-rag` extension does its own
separate ingestion of the same folder, automatically, with no code at all — that's
the whole point of endpoint #3.

### Known local issue: Netty can't open a selector

If `quarkus:dev` fails with something like:

```
Caused by: io.netty.channel.ChannelException: failed to open a new selector
Caused by: java.io.IOException: Unable to establish loopback connection
```

this is **not a bug in this project** — it's Netty failing to set up its internal
loopback wakeup socket on Windows, usually because a VPN client or endpoint-security
agent is intercepting `127.0.0.1` traffic for `java.exe`. It happens before any of
our code runs. Try:

1. Toggling off VPN / security-agent software and retrying.
2. Rebooting — stale network-adapter state after a VPN connect/disconnect is a
   common trigger.
3. Asking IT whether loopback traffic for Java processes is being intercepted.

It will fail identically regardless of JDK version (verified on both 21 and 17).

### Known upstream issue: Open WebUI dev card needs Docker

Even after the above is fixed, you may see an error mentioning
`OpenWebUIDevUIProcessor` and `Could not find a valid Docker environment` when dev
mode shuts down. This is a quarkus-langchain4j 1.11.2 dev-mode feature that
unconditionally tries to talk to Docker on shutdown, even though we never use
Docker in this project. There's currently no config flag to disable it. Either
start Docker Desktop, or ignore it — it fires on shutdown, after your requests have
already been served.

## 5. Try the four endpoints

All four take the same JSON body and answer the same question — that's
deliberate, so you can compare answers side by side. Pick a question whose answer
only exists in one of the newsletter PDFs (so the no-rag baseline is forced to
guess).

```bash
curl -X POST http://localhost:8080/ask/no-rag \
  -H "Content-Type: application/json" \
  -d '{"question":"What happened in the June 2026 newsletter?"}'

curl -X POST http://localhost:8080/ask/naive-rag \
  -H "Content-Type: application/json" \
  -d '{"question":"What happened in the June 2026 newsletter?"}'

curl -X POST http://localhost:8080/ask/easy-rag \
  -H "Content-Type: application/json" \
  -d '{"question":"What happened in the June 2026 newsletter?"}'

curl -X POST http://localhost:8080/ask/transformed-rag \
  -H "Content-Type: application/json" \
  -d '{"question":"What happened in the June 2026 newsletter?"}'
```

| Endpoint | What you're looking at |
|---|---|
| `/ask/no-rag` | Raw LLM call, no retrieval — expect a hallucinated/vague answer. |
| `/ask/naive-rag` | Hand-wired retriever (`NaiveRagAugmentorSupplier.java`) — read this file to see what a framework normally hides. |
| `/ask/easy-rag` | Same answer, config-only (`quarkus.langchain4j.easy-rag.*` in `application.properties`, `EasyRagAiService.java` has zero RAG code). |
| `/ask/transformed-rag` | Same as naive-rag plus a query transformer (`TransformedRagAugmentorSupplier.java`) — try a vague/badly-phrased question here vs. `/ask/naive-rag` to see the difference. |

## 6. Project layout

```
src/main/java/com/brain2/ragdemo/
  RagDemoResource.java              REST endpoints (the 4 routes above)
  AskRequest.java                   request DTO
  NewsletterStore.java              manual PDF ingestion + in-memory store, shared
                                     by naive-rag and transformed-rag
  NaiveRagAugmentorSupplier.java    RAG wiring for /ask/naive-rag
  TransformedRagAugmentorSupplier.java  RAG wiring for /ask/transformed-rag
  NaiveRagAiService.java / EasyRagAiService.java / TransformedRagAiService.java
                                     one declarative AI service interface per mode
src/main/resources/
  application.properties           model config + easy-rag config
  rag/*.pdf                        the newsletter corpus all four endpoints draw on
```

## 7. What NOT to do here

See "Explicit non-goals" in [DEMO.md](DEMO.md) — short version: no Postgres/pgvector,
no Cohere reranking, no agentic tool-calling, no native-image build. If you want to
experiment with any of those, do it as a separate branch, not in this demo.
