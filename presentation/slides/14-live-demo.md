# Slide 14 — Live demo (the star)

## On screen
Title: **"Now the part that can go wrong on purpose."** Four demo beats (no RAG → naive RAG → easy RAG → break-it-then-fix-it) and the reassuring `mvn quarkus:dev` line with the "15-minute panic window / pre-recorded backup" joke.

## Background — run of show
This is 8–10 minutes and the centre of gravity of the talk. Keep returning to slide 10 between beats.

1. **Ask with no RAG** — `POST /ask/no-rag` with a newsletter-specific question. Read the invented answer aloud. This is slide 3, live.
2. **Ask with naive RAG** — `POST /ask/naive-rag`, *same question*. Correct, grounded answer. Optionally flip to `NaiveRagAugmentorSupplier.java` and point at the two comments (slide 11).
3. **Swap to easy RAG** — `POST /ask/easy-rag`, same question, same answer. Show the `application.properties` lines that replaced the code (slide 12).
4. **Break it, then fix it** — `POST /ask/naive-rag` with a deliberately *vague* question; let it whiff. Then `POST /ask/transformed-rag` with the same vague question; it recovers (slide 13).
5. *(If time + Wi-Fi)* edit a prompt or `maxResults`, save, re-curl — live reload, no restart.

The money shot is beats 1→2 back to back: wrong answer, then right answer, same question. Let the contrast breathe before you explain it.

### curl crib (have these ready)
```bash
Q='{"question":"What did our June 2026 newsletter announce?"}'
curl -s -XPOST localhost:8080/ask/no-rag        -H 'Content-Type: application/json' -d "$Q"
curl -s -XPOST localhost:8080/ask/naive-rag      -H 'Content-Type: application/json' -d "$Q"
curl -s -XPOST localhost:8080/ask/easy-rag       -H 'Content-Type: application/json' -d "$Q"
# vague question for the break/fix beat:
V='{"question":"what about that time-off thing they mentioned?"}'
curl -s -XPOST localhost:8080/ask/naive-rag       -H 'Content-Type: application/json' -d "$V"
curl -s -XPOST localhost:8080/ask/transformed-rag -H 'Content-Type: application/json' -d "$V"
```

### Known gotchas on the demo machine (do NOT cold-start on stage)
- **Netty loopback / VPN**: dev mode can fail with `failed to open a new selector` / `Unable to establish loopback connection` — a Windows + VPN/endpoint-security issue, not the app. Mitigation: start the server *before* the session; if it bites, toggle VPN or reboot beforehand.
- **easy-rag Open WebUI dev card wants Docker**: dev mode's shutdown hook calls Docker; have Docker Desktop running, or just don't restart mid-talk.
- **API key**: `export OPENAI_API_KEY=sk-...` in the demo shell first; the app reads it from the env var.
- **Maven mirror**: off-VPN, build with `-s public-settings.xml` (the corporate Artifactory isn't reachable and doesn't allowlist the Quarkus/LangChain4j groups).

## What to say
"Okay — the part that can go wrong on purpose. Same question four times. [beat 1] No RAG: confident fiction. [beat 2] Naive RAG, same question: grounded, correct. Let that sit — same model, we just handed it the page. [beat 3] Easy RAG: same answer, and *this* — three properties — is what replaced the code. [beat 4] Now I'll ask something vague and naive RAG whiffs… and the transformed endpoint recovers it.
If anything crashes, I've got a fifteen-minute panic window and a recording I'm one Alt-Tab from."

## If asked
- *"Latency?"* — A second or two per call: one embedding + a vector search + the model call. Fine for interactive use; cache and async help at scale.
- *"Is this hitting the real OpenAI API?"* — Yes (chat model). Embeddings can be in-process or via OpenAI. Swappable for on-prem Ollama.

## Time
8–10 minutes. The demo is the talk — protect this budget; cut elsewhere if you're running long.
