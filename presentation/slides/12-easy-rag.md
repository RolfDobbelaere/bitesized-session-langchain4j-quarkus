# Slide 12 — Easy RAG: same answer, the code deleted

## On screen
Left: an empty `@RegisterAiService` interface (no retrieval code) plus two `application.properties` lines (`easy-rag.path`, `easy-rag.max-results`). Right: a checklist of what the extension did for you (scan folder, parse PDFs via Tika, chunk+embed into an in-memory store, wire a default retriever) and a caveat that it's a great default until you need to tune.

## Background
This is the biggest "oh" of the talk: all of slide 11's builder code collapses into **one config property**. The `quarkus-langchain4j-easy-rag` extension, on startup:
- scans the configured folder,
- parses every file (it uses **Apache Tika**, so PDFs, DOCX, HTML, plain text — even OCR'd images — all work),
- chunks and embeds them into an **in-memory** store (auto-registered if you don't provide one),
- and builds a **default `RetrievalAugmentor`** wired to your AiService automatically — so the interface needs no retrieval code at all.

Run `/ask/easy-rag` with the *same* question as the naive endpoint → the same grounded answer. Side by side with slide 11, the message is undeniable: the wiring became a path.

The **modernisation beat** lives here. The older workshop (the `step-08` tutorial) needed a separate embeddings dependency (`langchain4j-embeddings-bge-small-en-q`) and hand-written ingestion code (`RagIngestion`, `RagRetriever`). Today that's an extension plus a property. If you ran that tutorial a year ago, this is how much has changed.

Keep the **caveat** to stay credible: easy-rag is a fantastic on-ramp and a fine default, but it deliberately hides the knobs. When naive retrieval gives a bad answer (next slide), you drop back to the explicit augmentor from slide 11. Easy-rag and naive RAG aren't rivals — they're the same pipeline at two levels of control.

(One operational note for your own setup: easy-rag's dev-mode "Open WebUI" card wants Docker, which is one of the gotchas on the demo machine — see slide 14 notes.)

## What to say
"Now put this next to the previous slide. All that builder code? Gone. The interface has no retrieval code, and these two properties replace it. On startup the extension scans the folder, parses every PDF with Tika, chunks and embeds them, and wires a retriever to the service automatically.
Same question, same grounded answer — none of the wiring.
Here's the honest caveat: this is a brilliant default, but it hides the knobs. The moment retrieval gives you a bad answer, you'll want them back — which is exactly where we're going next.
And if you did this a year ago: it used to need a separate embeddings dependency and hand-written ingestion. Now it's a path. That's the pace this is moving at."

## If asked
- *"What file types?"* — Anything Apache Tika parses: PDF, DOCX, HTML, TXT, and more, including OCR for images.
- *"Can easy-rag use a real vector DB?"* — Yes — add a store extension (e.g. pgvector) and it uses that instead of in-memory.
- *"When should I NOT use easy-rag?"* — When you need to control chunking, query transformation, reranking, or prompt framing — then use an explicit augmentor.

## Time
~1.5 minutes. Demo step 3. The contrast with slide 11 *is* the point — show them together.
