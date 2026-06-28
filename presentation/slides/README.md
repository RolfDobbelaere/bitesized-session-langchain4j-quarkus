# Speaker notes — RAG, Four Ways

One markdown file per slide. Each file has the same shape:

- **On screen** — what the audience sees, so you can talk without turning around.
- **Background** — the deeper context, so you can field questions confidently. This is more than you'll say out loud; it's the "why" behind the slide.
- **What to say** — a suggested talk track. Not a script to read — beats to hit.
- **If asked** — likely questions and short answers.
- **Time** — rough budget. Total target ≈ 30 min including ~10 min demo.

The same talk-track lines are also embedded as PowerPoint speaker notes in `RAG-Four-Ways.pptx` (visible in Presenter View). These files are the longer-form companion.

| # | Slide | File | ~min |
|---|-------|------|------|
| 1 | Title | [01-title.md](01-title.md) | 1.0 |
| 2 | The setup (opener) | [02-the-setup.md](02-the-setup.md) | 2.0 |
| 3 | The problem: hallucination | [03-the-problem.md](03-the-problem.md) | 2.0 |
| 4 | RAG, defined | [04-rag-defined.md](04-rag-defined.md) | 1.5 |
| 5 | How RAG works (pipeline) | [05-how-rag-works.md](05-how-rag-works.md) | 2.5 |
| 6 | Why LangChain4j | [06-why-langchain4j.md](06-why-langchain4j.md) | 2.0 |
| 7 | Why Quarkus / JVM mode | [07-why-quarkus.md](07-why-quarkus.md) | 2.0 |
| 8 | Architecture at a glance | [08-architecture.md](08-architecture.md) | 1.5 |
| 9 | LangChain4j in five lines | [09-five-lines.md](09-five-lines.md) | 1.5 |
| 10 | RAG four ways (demo spine) | [10-four-ways.md](10-four-ways.md) | 1.0 |
| 11 | Naive RAG (wiring exposed) | [11-naive-rag.md](11-naive-rag.md) | 1.5 |
| 12 | Easy RAG (wiring deleted) | [12-easy-rag.md](12-easy-rag.md) | 1.5 |
| 13 | Query transformation | [13-query-transformation.md](13-query-transformation.md) | 2.0 |
| 14 | Live demo | [14-live-demo.md](14-live-demo.md) | 8–10 |
| 15 | Observability / Elastic APM | [15-observability.md](15-observability.md) | 2.0 |
| 16 | Dev today, prod tomorrow | [16-to-production.md](16-to-production.md) | 1.5 |
| 17 | Beyond RAG: memory (@MemoryId) | [17-memory.md](17-memory.md) | 1.5 |
| 18 | Beyond RAG: structured output (POJO) | [18-structured-output.md](18-structured-output.md) | 1.5 |
| 19 | Closing + Q&A | [19-closing.md](19-closing.md) | 2.0 |

## Assets for manual insertion
- `../assets/rag-pipeline.svg` — higher-fidelity version of the slide 5 diagram.
- `../assets/architecture.svg` — higher-fidelity version of the slide 8 diagram.

Both already exist natively in the deck; swap the SVG in only if you want the standalone art (e.g. for a handout). Insert via **Insert ▸ Pictures ▸ This Device** and it will scale crisply.

## Demo prerequisites (do these before you walk on stage)
1. `export OPENAI_API_KEY=sk-...` in the shell you'll demo from.
2. Start `mvn -s public-settings.xml quarkus:dev` and leave it running and warm — do **not** cold-start on stage (see [14-live-demo.md](14-live-demo.md) for the known Netty/Docker gotchas).
3. Have the backup recording one Alt-Tab away.
4. Pre-pick the question and know which newsletter holds the answer.
