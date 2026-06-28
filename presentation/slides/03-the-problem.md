# Slide 3 — The problem: hallucination

## On screen
Left: a chat mock of a **plain LLM** confidently inventing a "Q3 Synergy Initiative" and a "Lisbon office" from the June 2026 newsletter. Caption: *None of that exists. It made it up — fluently.*
Right: *Why this is a production problem* (training cut-off, can't say "I don't know", brand risk) and the punchline: *The fix isn't a smarter model. It's giving this one the answer key.*

## Background
"Hallucination" is the term, but the precise mechanism matters so you can answer questions:
- An LLM is a next-token predictor. It produces the *most plausible-sounding* continuation, which is correlated with truth on common knowledge but uncorrelated with truth on facts it never saw.
- Two structural reasons it can't know your newsletter content: (1) a **training cut-off** date, and (2) your internal documents were never in the training set at all.
- Critically, the model has no calibrated notion of "I don't know." Fluency and confidence are the same signal to it, which is exactly why hallucinations are dangerous — they look identical to correct answers.

The newsletter example is chosen on purpose: it's something the model provably cannot know, so the failure is unambiguous (not a coin-flip on a fact it might have memorised). That's also why it's the perfect RAG corpus — the contrast on the demo will be stark.

Real-world stakes to name: a customer-support bot inventing a refund or returns policy isn't a cute bug, it's a commitment your company may be held to, and a brand/legal incident.

## What to say
"Watch this. I ask a plain model what our June 2026 newsletter announced, and it tells me — confidently — about a 'Q3 Synergy Initiative' and a new Lisbon office. Every word of that is fiction, delivered with total confidence.
That's not the model being broken; that's the model doing exactly what it does — predicting plausible text. It has a training cut-off, it never saw our internal docs, and it has no way to say 'I don't know.'
Now imagine that's a support bot inventing a refund policy. That's not a bug ticket, that's a brand incident.
The fix isn't a smarter or bigger model. It's giving *this* model the answer key before it writes."

## If asked
- *"Won't a bigger / newer model fix this?"* — No. A bigger model hallucinates more convincingly about data it still hasn't seen. The cut-off and the private-data problem are structural, not capacity problems.
- *"What about fine-tuning?"* — Fine-tuning teaches style and format well, but it's a poor and expensive way to inject facts that change often. RAG keeps facts in a store you can update without retraining.

## Time
~2 minutes. In the live demo this slide is the `/ask/no-rag` step — you can foreshadow it here.
