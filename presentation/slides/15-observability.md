# Slide 15 — Observability without a re-org

## On screen
Two columns. **JVM mode (what you'll do):** attach the Elastic APM Java agent exactly as on your Spring apps — shows the `-javaagent` line; requests, DB calls, and the LLM call appear as spans in Kibana. **Native image (the fallback):** switch to the built-in OpenTelemetry extension, export over OTLP; same Kibana dashboards, vendor-neutral, slightly less auto-instrumentation.

## Background
This is the slide that wins over the people who sign off on production. Two paths:

**JVM mode (the default, and what this audience will actually deploy):**
- Attach the Elastic APM Java agent the same way you do today: `java -javaagent:elastic-apm-agent.jar -Delastic.apm.service_name=... -jar app.jar`.
- Because the whole RAG flow is in one JVM, the agent auto-instruments the HTTP server, datasource, and outbound HTTP (the LLM call) — so you see request latency, the vector-store query, and the model call as spans in Kibana, with errors and traces, no code changes.
- The message: **the LLM call is just another downstream HTTP dependency** to your APM. There's nothing new to operate.

**Native image (only if you went native on slide 7):**
- The Elastic APM *Java agent* needs a JVM, so it doesn't apply to a native binary. Instead use Quarkus's **OpenTelemetry** extension and export via **OTLP** to the same Elastic backend.
- Frame OTel as a feature, not a downgrade: it's vendor-neutral (traces, metrics, logs → Elastic, or Jaeger, or Datadog — your choice), so there's no lock-in at the observability layer either. The trade-off is slightly less automatic instrumentation than the dedicated agent; you sometimes add a span or two by hand.

**What is OpenTelemetry, in one line** (for Q&A): a vendor-neutral standard for collecting traces, metrics, and logs and exporting them to whatever backend you choose — instrument once, send anywhere.

If you have a **Kibana screenshot** of an LLM call rendered as a span, drop it on this slide — seeing the model latency inside their existing dashboard is the moment it clicks for an ops audience.

## What to say
"For most of you this is a non-event, and that's the whole point. JVM mode: attach the Elastic APM Java agent exactly the way you already do — same flag, same agent. Because it's all one JVM, you get the request, the vector search, and the model call as spans in Kibana for free. To your APM, the LLM is just another downstream HTTP call.
If you go native — which most of you won't need — the Java agent needs a JVM, so you switch to the built-in OpenTelemetry extension and export to the same Elastic backend over OTLP. Same dashboards, vendor-neutral, no lock-in. A little less automatic instrumentation, that's the trade.
Either way: no new tool, no new backend, nothing extra for DevOps to learn."

## If asked
- *"Can I see token usage / cost per call?"* — Not from the APM agent automatically; add a span attribute or a metric for tokens if you want cost observability. Easy to bolt on.
- *"OTel in JVM mode too?"* — Yes, if you prefer one instrumentation story across JVM and native. The APM agent is just the lowest-effort path for existing Elastic shops.
- *"Does the model provider see our data?"* — With a hosted model, yes — your prompts (including retrieved chunks) go to the provider. If that's unacceptable, run Ollama on-prem (slide 16) and nothing leaves the building.

## Time
~2 minutes. Lead with JVM mode; it's what they'll ship. Flash the Kibana screenshot if you have one.
