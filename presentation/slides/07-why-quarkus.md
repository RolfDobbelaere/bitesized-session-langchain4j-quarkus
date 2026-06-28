# Slide 7 — Why Quarkus, and why JVM mode is the boring, correct default

## On screen
Left: the developer-experience case — *sub-second start + live reload*, *familiar to JEE/Spring teams*, *Dev Services*.
Right: an honesty box — **JVM mode** (ship this; APM agent attaches as today) vs **Native image** (only if you need ~50ms start / tiny memory).

## Background
Two misconceptions to dismantle:

1. **"Quarkus = native images = a whole new ops model."** False. Quarkus runs on a standard JVM (OpenJDK). What it optimises is *build-time* work: it does annotation scanning, bean wiring, and configuration at build time instead of startup, which is why it starts fast and uses less memory than a comparable Spring Boot app — *in plain JVM mode*. Native image (via GraalVM) is an *optional* extra step, not the default.

2. **"You must compile to native for production."** False, and for this audience, counter-productive. Native image trades away the things a conservative shop relies on: the Elastic APM Java agent (which needs a JVM), straightforward JVM debugging, and standard GC tuning. Native is the right tool for serverless / scale-to-zero / aggressive autoscaling — not a requirement for a normal server deployment.

Why Quarkus specifically helps this talk:
- **Live reload** in `quarkus:dev`: edit code or `application.properties`, save, re-issue the request — the change is just there. This is what makes the live demo feel like magic without being magic. Under the hood dev mode runs on the JVM, so you can attach a debugger on port 5005 exactly as normal.
- **Familiar** to JEE/Spring developers: CDI (`@Inject`, `@ApplicationScoped`), JAX-RS (`@Path`, `@POST`). The migration path is short.
- **Dev Services**: in dev mode Quarkus can auto-start dependencies (databases, etc.) in containers so you don't hand-provision them. (Note: this is also the source of one demo gotcha — see slide 14 notes — because it wants Docker.)

Key sentence for the room: in JVM mode, your **Elastic APM Java agent attaches exactly as it does to your Spring apps today.** That single fact is what makes this whole approach palatable to a DevOps team that isn't looking for adventure.

## What to say
"Quick myth-bust: Quarkus does not mean native images and a new ops model. It runs on a normal JVM. What it does is move work — annotation scanning, wiring — to build time, so it starts in well under a second and uses less memory than the equivalent Spring Boot app. Native image is an *option*, not the price of admission.
For most of you, the right call is: ship the JAR, JVM mode, and attach the Elastic APM agent exactly the way you do today. Native image is there for serverless or scale-to-zero, and it trades away the APM Java agent and easy debugging to get there.
The developer win is live reload — and that's what you'll watch in the demo: change a property, save, re-curl, no restart."

## If asked
- *"Is JVM-mode Quarkus really fine in production?"* — Yes. Plenty of teams run JVM mode in production; it's faster to start and lighter than Spring Boot, and fully debuggable. Native is an optimisation for specific workloads.
- *"Can I keep my APM?"* — In JVM mode, unchanged. In native, you switch to the OpenTelemetry extension exporting to the same backend (slide 15).
- *"Migration effort from Spring?"* — Concept-for-concept mapping (DI, REST, config). Not zero, but not a rewrite; this is the cheapest "new framework" you'll evaluate.

## Time
~2 minutes. The JVM-vs-native honesty is the trust-builder — say "ship the JAR" plainly.
