# Slide 17 — Beyond RAG: memory (@MemoryId)

## On screen
Title: **Memory: hand it a session id, it remembers.** Left: the `ConversationalAssistant` AiService — `String chat(@MemoryId String sessionId, @UserMessage String message)` — and the `POST /chat/memory` body carrying `sessionId`. Right: a "same id → it remembers" mini-conversation, and a note that a different sessionId starts blank (default: last 10 messages, in-memory, per id).

## Background
This is the first of two short "the AiService does more than RAG" slides. Deliberately **no RAG** — the whole point is to show one feature in isolation.

How it works:
- Add a parameter annotated `@MemoryId` to an AiService method. quarkus-langchain4j keeps a **separate chat-memory per id**, automatically.
- The default `ChatMemoryProvider` is a `MessageWindowChatMemory` holding the **last 10 messages**, in an **in-memory store** — zero config. Each turn, that session's history is replayed into the prompt before the model answers, which is what creates the illusion (and the reality) of memory.
- The id is just a `String` you pass in. In a real app it's a user id or a conversation/session id from your web layer. Here the caller puts it in the POST body so the demo is obvious.
- Isolation is free: different id → different (empty) history. Same id → continuity.

Production note (one line on stage if asked): swap the in-memory store for a persistent `ChatMemoryStore` (e.g. backed by Redis or a DB) to survive restarts and scale horizontally — same annotation, different store bean.

Why it's RAG-free in code: the easy-rag extension would otherwise auto-attach its default retrieval augmentor to any AiService; this one opts out via `retrievalAugmentor = NoRagAugmentorSupplier.class` (a pass-through). So memory is shown cleanly, with no newsletter retrieval muddying it.

## What to say
"Quick aside — the AiService abstraction does more than RAG. Here's memory, and the entire feature is one annotation. I add a `@MemoryId` parameter, and Quarkus keeps a separate conversation per id for me — by default the last ten messages, in memory, no setup.
Watch: under session 'rolf' I say 'my name is Rolf, I like Java.' Ask again in the same session — it remembers. Switch to a different session id and it has no idea who I am. The id is the only thing that changed. That's it. No database, no RAG."

## Live demo (optional) — Bruno folder "5 - Memory"
1. `5.1` POST /chat/memory {sessionId: "rolf", "My name is Rolf and my favourite language is Java."}
2. `5.2` same session → "What's my name and favourite language?" → remembers.
3. `5.3` different session ("guest-42") → "What's my name?" → doesn't know.

## If asked
- *"Where's the history stored?"* — In-memory by default (lost on restart). Swap in a persistent `ChatMemoryStore` for production.
- *"How many messages?"* — Default window is 10; configurable, or use a token-window memory.
- *"Does this use more tokens?"* — Yes, history is re-sent each turn; that's why the window is bounded.

## Time
~1.5 minutes. Keep it tight — it's a palate cleanser between the RAG story and the close.
