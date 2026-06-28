# Slide 11 — Naive RAG: the wiring, fully exposed

## On screen
Code (`NaiveRagAugmentorSupplier.java`): build an `EmbeddingStoreContentRetriever` over the store, then a `DefaultRetrievalAugmentor` with that retriever and a content injector that pastes chunks into the prompt. Right: *This is the entire trick — a retriever finds chunks, an injector pastes them. No framework is hiding anything.*

## Background
The teaching goal is **demystification**. People assume RAG frameworks do something clever and opaque. This slide shows the two pieces, both readable:
- **ContentRetriever** — given the question, returns the top-k most similar chunks from the embedding store. Configured with the store, the embedding model, and `maxResults`.
- **RetrievalAugmentor** — orchestrates "retrieve, then modify the prompt." The **ContentInjector** is the part that literally appends the retrieved text to the user message before it goes to the model.

In the real code this augmentor is exposed as a `Supplier<RetrievalAugmentor>` CDI bean and bound to the AiService via `@RegisterAiService(retrievalAugmentor = NaiveRagAugmentorSupplier.class)`. That's how one app hosts several differently-configured RAG endpoints.

Don't read every line on stage. Point at the two comments — "find relevant chunks" and "paste them into the prompt" — that's the whole mental model. Then set up the next slide's punchline: this is worth understanding once, and then you'll never type it again.

API note: in current LangChain4j the injector's method signature is `inject(List<Content>, ChatMessage)` (older examples show `UserMessage`); a detail, but it's why the demo code casts to `UserMessage`.

## What to say
"Let me show you what RAG actually *is*, with nothing hidden. Two pieces. First, a retriever — give it the question, it returns the most relevant chunks from the store. Second, an augmentor with an injector — and the injector literally pastes those chunks into the prompt before it goes to the model.
That's it. That's the trick. No framework is doing anything mysterious here.
This is worth seeing once — and then watch how much of it we can delete."

## If asked
- *"How does it know how many chunks to fetch?"* — `maxResults` on the retriever (3 in the demo). Tunable; more isn't always better.
- *"Can I customise the prompt wording?"* — Yes — the ContentInjector is where you control exactly how context is framed for the model. That's a real tuning lever managed RAG hides.
- *"Where's the store populated?"* — At startup, in `NewsletterStore` — parse PDFs, chunk, embed, add to an in-memory store.

## Time
~1.5 minutes. Demo step 2. Point at the two comments, don't recite the code.
