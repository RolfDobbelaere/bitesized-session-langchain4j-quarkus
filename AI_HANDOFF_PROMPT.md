# Handoff prompt — paste this into the AI on the new PC

> Copy everything inside the code fence below as your first message to the AI on
> the machine that can run Quarkus dev mode. It assumes that machine has a clone
> of this repo (`bitesized-session-langchain4j-quarkus`), Java 21, Maven, and
> Ollama installed (models not yet pulled).

```
You're helping me (Rolf) finish preparing a ~25–30 minute "bite-sized session"
conference talk titled "RAG, Four Ways" — building grounded AI in Java with
Quarkus + LangChain4j + RAG, for an enterprise Java (JEE/Spring) audience. Tone
throughout the materials is dry, understated humor — keep that if you touch copy.

Most of the work is already done and lives in this repo. Your job on THIS machine
is to get the demo actually running on local Ollama and validate it end to end —
something the previous machine couldn't do because of an OS-level Winsock bug
(details at the bottom; you almost certainly won't hit it here).

FIRST, orient yourself by reading these files (in order):
- DEMO.md ............................. what the demo proves, the 4-endpoint design
- langchain4j-quarkus-example-1/OLLAMA.md ... the local-model setup + benchmarks
- langchain4j-quarkus-example-1/JUNIOR_DEV_STARTUP.md ... how to run, known gotchas
- bruno-requests/BiteSizedSession-LangChain4J/DEMO_BRUNO_REQUESTS.md ... the demo run-of-show
- presentation/slides/README.md ....... index of the per-slide talk track

THE DEMO IN ONE PARAGRAPH:
A Quarkus app (project folder: langchain4j-quarkus-example-1) exposes four POST
endpoints that answer the SAME question four ways, over a corpus of company
newsletter PDFs (src/main/resources/rag/, "The Chronicles"):
  POST /ask/no-rag         -> plain LLM, hallucinates (it never saw the newsletters)
  POST /ask/naive-rag      -> hand-wired retriever + augmentor, grounded answer
  POST /ask/easy-rag       -> quarkus-langchain4j-easy-rag, same answer, config-only
  POST /ask/transformed-rag-> naive + a query-rewriting transformer (recovers vague Qs)
Body is JSON {"question":"..."}, response is text/plain. Don't read the PDFs unless
you must — they're real company newsletters; treat them as sensitive.

There are also two NON-RAG feature demos (slides 17–18, Bruno folders 5 & 6):
  POST /chat/memory  {"sessionId":"rolf","message":"..."}  -> @MemoryId chat memory
                       (same id remembers, different id is isolated); response text/plain
  POST /games        {"genre":"open-world RPG","count":3}   -> returns a typed JSON POJO
                       (the LLM answers as a Java record; structured output). JSON response.
These deliberately use no RAG (they opt out via NoRagAugmentorSupplier).

YOUR TASKS, IN ORDER:
1. Pull the two models (chosen + benchmarked for a CPU-only laptop):
       ollama pull llama3.2:3b
       ollama pull nomic-embed-text
   Then pre-warm them (keep_alive) so the first answer isn't slow — commands are in
   OLLAMA.md.
2. Start the app in the Ollama profile from the langchain4j-quarkus-example-1 folder:
       mvn quarkus:dev -Dquarkus.profile=ollama
   (If Maven can't resolve the Quarkus/LangChain4j artifacts because of a corporate
   mirror, use:  mvn -s public-settings.xml quarkus:dev -Dquarkus.profile=ollama
   — but on a clean Maven setup plain `mvn` is fine.)
   Wait for "Listening on http://localhost:8080".
3. Smoke-test the contrast that is the heart of the demo. Same question to two
   endpoints:
       curl -s -XPOST localhost:8080/ask/no-rag    -H 'Content-Type: application/json' -d '{"question":"Can I earn money from the newsletter? If so, how?"}'
       curl -s -XPOST localhost:8080/ask/naive-rag  -H 'Content-Type: application/json' -d '{"question":"Can I earn money from the newsletter? If so, how?"}'
   Expected: no-rag invents / deflects; naive-rag returns the real grounded answer
   (the newsletter runs a contest — win a gift card for the best summer photo).
   Report both answers to me verbatim.
4. If that works, also try the break/fix pair and the other two demo questions
   (they're all pre-built as Bruno requests in bruno-requests/, and described in
   DEMO_BRUNO_REQUESTS.md). The three signature questions are:
     - "Can I earn money from the newsletter? If so, how?"
     - "Who is Rolf?"
     - "Is Steven Put an influencer? He seems to travel a lot."
   And the vague break/fix question: "what was that summer thing they mentioned
   where you could win something?" (naive whiffs, transformed-rag recovers).
5. Tell me whether the live demo behaves well on this machine, and flag anything
   that looks off (slow generation, wrong retrieval, etc.). At ~7 tok/s on a small
   CPU, keep answers short — the prompts already ask for 2–3 sentences.

PERFORMANCE NOTES (from benchmarking on the other laptop, CPU-only):
- llama3.2:3b generates ~7 tokens/sec on a 4-core CPU; a 2–3 sentence answer ≈ 9s.
- transformed-rag makes an EXTRA LLM call (the query rewrite), so it's ~2x slower —
  expect 20–30s on Ollama. That's normal; narrate it on stage.
- If this machine has an NVIDIA/AMD GPU, Ollama will use it and everything is much
  faster — great, just confirm `ollama ps` shows GPU.

STILL OPEN / FYI (don't action unless I ask):
- A git push to origin (github.com/RolfDobbelaere/bitesized-session-langchain4j-quarkus)
  is pending and NOT done. Before any push, check repo visibility and DO NOT publish
  the company newsletter PDFs (src/main/resources/rag/*.pdf) to a public repo — and
  add a .gitignore for target/, node_modules/, and presentation/render/ first.
- There's a polished PowerPoint at presentation/RAG-Four-Ways.pptx (17 slides) with
  per-slide notes in presentation/slides/ — don't rebuild it unless I ask.

WHY THE OTHER MACHINE FAILED (so you can confirm you're NOT hitting it):
On the previous laptop, `quarkus:dev` always failed with
"java.io.IOException: Unable to establish loopback connection: Invalid argument:
connect". I proved it was OS-level, not the project: a bare 8-line Java program
calling java.nio.channels.Selector.open() failed identically (JDK 21's selector
uses an AF_UNIX self-pipe on Windows, and a leftover Pulse Secure Winsock LSP was
mangling the connect). The fix there is `netsh winsock reset` + reboot. To confirm
THIS machine is healthy, you can compile and run this and expect "ALL NIO LOOPBACK OK":
    import java.nio.channels.*;
    public class SelTest { public static void main(String[] a) throws Exception {
      Pipe.open(); Selector.open().close(); System.out.println("ALL NIO LOOPBACK OK"); } }
If that prints OK, the loopback bug is absent and the app will start normally.

Start by reading DEMO.md and OLLAMA.md, then pull the models and run the smoke test.
```
