# Slide 5 — How RAG works (the pipeline)

## On screen
Two phases. **Ingestion (at startup):** 1) Split & embed, 2) Store. **Query (per request):** 3) Embed the question, 4) Similarity search, 5) Inject + generate.
A higher-fidelity standalone version is in `../assets/rag-pipeline.svg`.

## Background
The two-phase split is the mental model that prevents confusion later:

**Ingestion — happens once, at startup (or on a schedule):**
1. **Split** documents into chunks. Chunk size is a real tuning knob: too big and retrieval returns noise around the relevant sentence; too small and you lose context. The demo uses ~300-token chunks with a small overlap so sentences aren't cut mid-thought.
2. **Embed** each chunk: an embedding model turns text into a vector (a list of numbers) that encodes meaning. **Store** the vectors in an embedding store.

**Query — happens on every request:**
3. **Embed the question** with the *same* embedding model, so the question and the chunks live in the same vector space.
4. **Similarity search**: find the chunks whose vectors are nearest the question's vector (cosine similarity / nearest-neighbour). This is semantic matching — meaning, not keywords.
5. **Inject + generate**: paste the top-k chunks into the prompt and let the model answer from them.

Things worth knowing for Q&A:
- **Embeddings ≠ the chat model.** They're two different models. The demo runs embeddings in-process (or via the OpenAI embedding endpoint) and the chat model via the provider.
- **Ingestion is the expensive part**; querying is cheap (one embedding call + a vector search). In production you ingest on a schedule, not per request.
- **"Top-k"** is `maxResults` in the code — how many chunks you retrieve. More context isn't always better; irrelevant chunks dilute the prompt.

## What to say
"Two phases. First, ingestion — and this only happens at startup. We chop the documents into chunks, turn each chunk into a vector with an embedding model, and store those vectors. That's the expensive part, and it's done before any user shows up.
Then, per request: we embed the *question* with the same model, search for the nearest chunks in vector space, and paste them into the prompt. Step five, the model answers from those chunks instead of from memory.
The one thing to internalise: retrieval is by *meaning*, not keywords. 'Time off' can pull back the holiday-policy paragraph even with no words in common, because they sit close together in vector space."

## If asked
- *"What's an embedding, concretely?"* — Text in, a fixed-length list of numbers out, arranged so similar meanings are close together. You don't need to understand the math to use it.
- *"Which embedding model?"* — Demo can use an in-process ONNX model or OpenAI's `text-embedding-3-small`. The key rule: embed documents and questions with the *same* model.
- *"How are chunks split?"* — A recursive splitter on size with overlap; LangChain4j's `DocumentSplitters.recursive(size, overlap)`.

## Time
~2.5 minutes — the most important conceptual slide. Don't rush it. Resist going academic on embeddings; one sentence is enough.
