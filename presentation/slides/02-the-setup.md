# Slide 2 — The setup (dry-humor opener)

## On screen
Title: **"Nobody's been asking for another Java framework."**
Three cards: *Python & JS got the demos* · *Your data didn't move* · *The gap is just plumbing.*

## Background
This slide does two jobs: it earns trust by saying out loud what the audience is thinking (framework fatigue is real), then it reframes the problem so the rest of the talk lands.

The reframe is the important part. Enterprise teams over-estimate the "AI" part and under-estimate the "integration" part. In practice, the model is a managed API you call over HTTPS — the genuinely hard, valuable work is:
- getting your private documents into a form the model can use (chunking, embeddings),
- doing it securely (the data stays where compliance expects it),
- and observing it like any other production dependency.

Every one of those is a classic Java-shop competency. The point isn't that Java is magic; it's that the work in front of you is work you already know how to do.

The "held meetings" line is the dry-humor beat — it's self-aware about enterprise Java culture without being bitter. Keep it deadpan.

## What to say
"Let's be honest: nobody woke up wanting another Java framework. While Python and JavaScript got every shiny AI demo, the Java world mostly… convened a working group.
But here's the thing the demos skip over: your data never moved. It's in the same databases, behind the same firewall, watched by the same APM agent it was last year. Connecting a model to that data safely is an integration problem — and we've been doing integration problems since before some of these AI startups existed.
So this isn't revolutionary. It's just convenient. And convenient is underrated."

## If asked
- *"Why not just use a Python RAG framework and call it from Java?"* — You can, but now you operate two runtimes, two dependency stories, two deploy pipelines, and two things to observe. Staying on the JVM removes a whole operational seam.
- *"Isn't LangChain (Python) more mature?"* — More features, yes. But you rarely need the long tail, and LangChain4j covers the RAG path cleanly. Maturity you can't deploy on your stack isn't maturity you can use.

## Time
~2 minutes. This is the attention-grab — slow down and let the reframe breathe.
