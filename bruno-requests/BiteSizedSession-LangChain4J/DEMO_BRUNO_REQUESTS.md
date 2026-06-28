# Bruno requests — demo runbook

HTTP requests that drive the live demo, organised to match the four demo beats on
slides 10–14. Open this collection in **Bruno**, pick the **Local** environment
(top-right), and fire the requests in order.

> The request bodies use `{{baseUrl}}` = `http://localhost:8080` (set in
> `environments/Local.bru`). Change it there if you run on another port.

---

## ⚠️ Before you start — run the RIGHT app

These requests hit `POST /ask/no-rag`, `/ask/naive-rag`, `/ask/easy-rag`,
`/ask/transformed-rag` — endpoints that live in the **`langchain4j-quarkus-example-1`**
project. Make sure *that* project is the one running on `:8080`:

```bash
cd C:\WEBINAR\bitesized-session-langchain4j-quarkus\langchain4j-quarkus-example-1
mvn -s public-settings.xml quarkus:dev                       # OpenAI (needs OPENAI_API_KEY)
#   …or fully local, nothing leaves the laptop:
mvn -s public-settings.xml quarkus:dev -Dquarkus.profile=ollama
```

Do **not** run the old `step-08` tutorial for this demo — it pulls a
`pgvector` Postgres container via Dev Services, needs Docker, and on this machine
fails with a Docker API-version mismatch (`client version … too old`). The new
project has no Docker dependency and sidesteps all of that. If a request returns a
big HTML *"Error restarting Quarkus"* page mentioning `pgvector`, you're pointed at
step-08 — stop it and start `langchain4j-quarkus-example-1`.

**Pre-warm if using Ollama** so the first answer on stage isn't slow — see
`langchain4j-quarkus-example-1/OLLAMA.md`.

---

## The collection at a glance

| Folder | Endpoint | Demo beat | What it shows |
|--------|----------|-----------|----------------|
| **1 - No RAG (the problem)** | `/ask/no-rag` | Beat 1 | The model guesses / hallucinates — it never saw your newsletters. |
| **2 - Naive RAG (by hand)** | `/ask/naive-rag` | Beat 2 | Same questions, grounded by a hand-wired retriever + augmentor. |
| **3 - Easy RAG (by config)** | `/ask/easy-rag` | Beat 3 | Same answer as naive, but the retrieval code is deleted — config only. |
| **4 - Transformed RAG (tuning)** | `/ask/transformed-rag` | Beat 4 | A vague question that naive RAG fumbles and query-rewriting recovers. |

Every request carries its own notes in Bruno's **Docs** tab.

---

## Run of show (what to fire, when)

### Beat 1 — set up the problem  →  folder **1 - No RAG**
Fire these against the plain model so the audience sees confident nonsense:

1. **`1.1 Earn money - NO RAG`** — *"Can I earn money from the newsletter? If so, how?"*
   The model can't know, so it deflects or invents a scheme. This is your money shot
   — keep the answer on screen.
2. **`1.2 Who is Rolf - NO RAG`** — *"Who is Rolf?"* It guesses some unrelated Rolf,
   or refuses. Not *your* Rolf.
3. **`1.3 Steven Put influencer - NO RAG`** — *"Is Steven Put an influencer? He seems
   to travel a lot."* The leading phrasing baits it into a fabricated backstory.

### Beat 2 — the same questions, grounded  →  folder **2 - Naive RAG**
Re-ask the **same** questions through the hand-wired RAG endpoint. The wrong→right,
same-question contrast is the heart of the demo:

1. **`2.1 Earn money - naive RAG`** — now it surfaces the real answer (the summer
   photo gift-card contest). Run `1.1` then `2.1` back to back and let it land.
2. **`2.2 Who is Rolf - naive RAG`** — grounded in what the newsletters say about Rolf.
3. **`2.3 Steven Put influencer - naive RAG`** — sticks to the real mentions of Steven
   and ideally pushes back on the "influencer" premise. RAG also curbs over-eager
   agreement.

### Beat 3 — same answer, no code  →  folder **3 - Easy RAG**
1. **`3.1 Earn money - easy RAG`** — same question as `1.1`/`2.1`, essentially the
   same grounded answer, but this endpoint has **zero** retrieval code. Fire it right
   after `2.1` and flip to `application.properties` to show the `easy-rag.*` lines
   that replaced the wiring.

### Beat 4 — break it, then fix it  →  folder **4 - Transformed RAG**
1. **`4.1 Vague summer prize - naive (whiffs)`** — a deliberately woolly question
   (*"what was that summer thing they mentioned where you could win something?"*).
   Naive retrieval embeds a fuzzy vector and gives a weak/wrong answer. **Let it fail.**
2. **`4.2 Vague summer prize - transformed (recovers)`** — the **same** vague question,
   but this endpoint rewrites it before retrieving, so the right chunks come back and
   the answer recovers. Same wording from the user, better result.

---

## Tips for the live run

- **Pick the Local environment** in Bruno (top-right) or `{{baseUrl}}` won't resolve.
- **Latency:** OpenAI replies in ~1–2 s. Local Ollama is ~9 s for a short answer;
  `transformed-rag` makes an **extra** rewrite call, so it's ~2× — expect 20–30 s on
  Ollama. That's the cost of the rewrite, worth narrating on stage.
- **Keep answers short on Ollama** (the prompts already ask for 2–3 sentences) so each
  response lands quickly.
- **If naive RAG accidentally nails the vague question** on the day, make `4.1` vaguer
  (e.g. *"what about that thing for the holidays?"*) so the recovery in `4.2` is visible.
- **Responses are plain text** (`text/plain`), so Bruno shows the answer directly in the
  Response pane — no JSON unwrapping needed.
- Want extra before/after pairs? Duplicate any Beat-1 request and change the URL path to
  `naive-rag` / `easy-rag` — the body stays identical.
