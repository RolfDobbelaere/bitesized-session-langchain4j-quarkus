/*
 * Deck generator: "RAG, Four Ways" — Quarkus + LangChain4j + RAG, 30-min session.
 * Dry-humor enterprise-Java talk. Premium dark theme.
 */
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");

// ---------- palette ----------
const C = {
  bg:      "0E1726", // midnight navy (dominant)
  panel:   "16202F", // slightly lifted panel
  card:    "1E293B", // card surface
  cardHi:  "243349", // hovered/featured card
  coral:   "FF4D6A", // accent A — "the hype / the wrong answer"
  emerald: "34D399", // accent B — "grounded / correct"
  amber:   "FBBF24", // code keywords / small highlights
  ice:     "CBD5E1", // primary body text on dark
  muted:   "8294AE", // captions / secondary
  white:   "FFFFFF",
  code:    "0A111E", // code surface
  line:    "2B3A52", // hairlines
};

const FONT_H = "Arial";       // headers (safe, true-to-width in QA)
const FONT_B = "Calibri";     // body (safe)
const FONT_M = "Courier New"; // code (safe monospace)

const W = 13.333, H = 7.5, M = 0.7;

const pres = new pptxgen();
pres.defineLayout({ name: "WIDE", width: W, height: H });
pres.layout = "WIDE";
pres.author = "Rolf Dobbelaere";
pres.title = "RAG, Four Ways — Quarkus + LangChain4j";

// fresh shadow objects (pptxgenjs mutates these in place)
const shadow = (o = {}) => ({ type: "outer", color: "000000", blur: 9, offset: 3, angle: 90, opacity: 0.28, ...o });

// ---------- icon rasterizer ----------
async function icon(IconComponent, color = "#FFFFFF", size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}
const hex = (s) => "#" + s;

// ---------- reusable slide chrome ----------
function base(slide) {
  slide.background = { color: C.bg };
}

// section eyebrow chip + big title + optional kicker line
function header(slide, { tag, title, kicker, accent = C.coral, num }) {
  // monospace tag chip (the recurring motif)
  if (tag) {
    slide.addText(tag, {
      x: M, y: 0.52, w: 4.5, h: 0.34, align: "left", valign: "middle",
      fontFace: FONT_M, fontSize: 12, color: accent, bold: true, charSpacing: 2, margin: 0,
    });
  }
  slide.addText(title, {
    x: M, y: 0.84, w: W - 2 * M - 1.4, h: 0.95, align: "left", valign: "top",
    fontFace: FONT_H, fontSize: 32, color: C.white, bold: true, margin: 0,
  });
  if (kicker) {
    slide.addText(kicker, {
      x: M, y: 1.74, w: W - 2 * M - 1.4, h: 0.5, align: "left", valign: "top",
      fontFace: FONT_B, fontSize: 15, color: C.muted, italic: true, margin: 0,
    });
  }
  if (num != null) {
    slide.addText(String(num).padStart(2, "0"), {
      x: W - M - 1.2, y: 0.5, w: 1.2, h: 0.9, align: "right", valign: "top",
      fontFace: FONT_H, fontSize: 40, color: C.line, bold: true, margin: 0,
    });
  }
}

function footer(slide, n) {
  slide.addText([
    { text: "RAG, Four Ways", options: { color: C.muted } },
    { text: "   ·   Quarkus + LangChain4j", options: { color: C.line } },
  ], { x: M, y: H - 0.5, w: 7, h: 0.3, fontFace: FONT_B, fontSize: 9, align: "left", valign: "middle", margin: 0 });
  slide.addText(String(n), {
    x: W - M - 0.8, y: H - 0.5, w: 0.8, h: 0.3, align: "right", valign: "middle",
    fontFace: FONT_M, fontSize: 9, color: C.muted, margin: 0,
  });
}

// card surface
function card(slide, x, y, w, h, fill = C.card) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.09, fill: { color: fill }, line: { color: C.line, width: 1 },
    shadow: shadow(),
  });
}

// code panel with monospace rich-text lines
function codePanel(slide, x, y, w, h, lines, opts = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.06, fill: { color: C.code }, line: { color: C.line, width: 1 }, shadow: shadow(),
  });
  // window dots
  slide.addShape(pres.shapes.OVAL, { x: x + 0.22, y: y + 0.2, w: 0.12, h: 0.12, fill: { color: "FF5F57" } });
  slide.addShape(pres.shapes.OVAL, { x: x + 0.42, y: y + 0.2, w: 0.12, h: 0.12, fill: { color: "FEBC2E" } });
  slide.addShape(pres.shapes.OVAL, { x: x + 0.62, y: y + 0.2, w: 0.12, h: 0.12, fill: { color: "28C840" } });
  if (opts.file) {
    slide.addText(opts.file, {
      x: x + 0.9, y: y + 0.14, w: w - 1.1, h: 0.26, fontFace: FONT_M, fontSize: 10.5, color: C.muted,
      align: "left", valign: "middle", margin: 0,
    });
  }
  slide.addText(lines, {
    x: x + 0.28, y: y + 0.5, w: w - 0.5, h: h - 0.7, fontFace: FONT_M, fontSize: opts.fontSize || 12.5,
    color: C.ice, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.18,
  });
}

// monospace token helpers for code coloring
const kw = (t) => ({ text: t, options: { color: C.coral } });
const str = (t) => ({ text: t, options: { color: C.emerald } });
const cm = (t) => ({ text: t, options: { color: C.muted, italic: true } });
const an = (t) => ({ text: t, options: { color: C.amber } });
const pl = (t) => ({ text: t, options: { color: C.ice } });
const br = (run) => ({ ...run, options: { ...run.options, breakLine: true } });

// ============================================================
async function build() {
  const I = {
    robot:   await icon(fa.FaRobot, hex(C.bg)),
    ghost:   await icon(fa.FaGhost, hex(C.coral)),
    book:    await icon(fa.FaBookOpen, hex(C.emerald)),
    diagram: await icon(fa.FaProjectDiagram, hex(C.emerald)),
    unlock:  await icon(fa.FaLockOpen, hex(C.emerald)),
    bolt:    await icon(fa.FaBolt, hex(C.amber)),
    layers:  await icon(fa.FaLayerGroup, hex(C.emerald)),
    code:    await icon(fa.FaCode, hex(C.amber)),
    list:    await icon(fa.FaListOl, hex(C.coral)),
    wrench:  await icon(fa.FaWrench, hex(C.ice)),
    magic:   await icon(fa.FaMagic, hex(C.emerald)),
    sync:    await icon(fa.FaSyncAlt, hex(C.amber)),
    terminal:await icon(fa.FaTerminal, hex(C.emerald)),
    chart:   await icon(fa.FaChartLine, hex(C.emerald)),
    server:  await icon(fa.FaServer, hex(C.ice)),
    check:   await icon(fa.FaCheckCircle, hex(C.emerald)),
    cross:   await icon(fa.FaTimesCircle, hex(C.coral)),
    cloud:   await icon(fa.FaCloud, hex(C.ice)),
    shield:  await icon(fa.FaShieldAlt, hex(C.emerald)),
    quote:   await icon(fa.FaQuoteLeft, hex(C.line)),
  };

  // small icon-in-circle helper
  function iconChip(slide, x, y, d, iconData, ring = C.cardHi) {
    slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: ring }, line: { color: C.line, width: 1 } });
    const p = d * 0.28;
    slide.addImage({ data: iconData, x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
  }

  // ---- numbered process step (for native pipeline) ----
  function stepBox(slide, x, y, w, h, n, title, body, accent) {
    card(slide, x, y, w, h, C.card);
    slide.addShape(pres.shapes.OVAL, { x: x + 0.22, y: y + 0.22, w: 0.5, h: 0.5, fill: { color: accent } });
    slide.addText(String(n), { x: x + 0.22, y: y + 0.22, w: 0.5, h: 0.5, align: "center", valign: "middle",
      fontFace: FONT_H, fontSize: 18, bold: true, color: C.bg, margin: 0 });
    slide.addText(title, { x: x + 0.22, y: y + 0.82, w: w - 0.44, h: 0.4, fontFace: FONT_H, fontSize: 14.5,
      bold: true, color: C.white, align: "left", valign: "top", margin: 0 });
    slide.addText(body, { x: x + 0.22, y: y + 1.24, w: w - 0.44, h: h - 1.4, fontFace: FONT_B, fontSize: 11.5,
      color: C.muted, align: "left", valign: "top", margin: 0 });
  }

  // =========================================================
  // SLIDE 1 — TITLE
  // =========================================================
  let s = pres.addSlide(); base(s);
  // faint oversized motif numeral
  s.addText("RAG", { x: 6.0, y: -0.6, w: 7.6, h: 4.2, align: "right", fontFace: FONT_H, fontSize: 200,
    bold: true, color: C.panel, margin: 0 });
  s.addText("// bite-sized session", {
    x: M, y: 1.5, w: 8, h: 0.4, fontFace: FONT_M, fontSize: 14, color: C.emerald, bold: true, charSpacing: 2, margin: 0 });
  s.addText("RAG, Four Ways", {
    x: M, y: 1.95, w: 11.6, h: 1.5, fontFace: FONT_H, fontSize: 68, bold: true, color: C.white, margin: 0 });
  s.addText([
    { text: "Grounded AI in Java — with ", options: { color: C.ice } },
    { text: "Quarkus", options: { color: C.coral, bold: true } },
    { text: " + ", options: { color: C.muted } },
    { text: "LangChain4j", options: { color: C.emerald, bold: true } },
  ], { x: M, y: 3.35, w: 11.6, h: 0.6, fontFace: FONT_B, fontSize: 23, margin: 0 });
  s.addText("Teaching a language model to stop making things up — without rebuilding your infrastructure.", {
    x: M, y: 4.05, w: 10.5, h: 0.6, fontFace: FONT_B, fontSize: 15, italic: true, color: C.muted, margin: 0 });
  // presenter line
  s.addShape(pres.shapes.LINE, { x: M, y: 5.35, w: 3.2, h: 0, line: { color: C.line, width: 1 } });
  s.addText([
    { text: "Rolf Dobbelaere", options: { color: C.white, bold: true, breakLine: true } },
    { text: "~30 minutes · one live demo · zero containers", options: { color: C.muted, fontSize: 13 } },
  ], { x: M, y: 5.5, w: 9, h: 0.8, fontFace: FONT_B, fontSize: 16, margin: 0 });
  iconChip(s, W - M - 1.5, 5.35, 1.5, I.robot, C.emerald);
  s.addNotes(
    "Land the title and the promise in one breath: by the end you'll know how to make an LLM answer from YOUR data, in Java, on the stack you already run. " +
    "The three constraints in the subtitle are the whole pitch — grounded answers, Java, no infrastructure change. " +
    "Dry opener works here: 'Thirty minutes, one live demo, and zero containers — so if you're from DevOps, you can relax.'"
  );
  footer(s, 1);

  // =========================================================
  // SLIDE 2 — THE SETUP (dry-humor opener)
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// the setup", title: "Nobody's been asking for another Java framework", accent: C.coral, num: 2 });
  s.addText("And yet, here we are. Let me explain why this one earns the slot.", {
    x: M, y: 1.74, w: 11.4, h: 0.5, fontFace: FONT_B, fontSize: 15, italic: true, color: C.muted, margin: 0 });

  const cols = [
    { i: I.ghost, t: "Python & JS got the demos", b: "Every AI tutorial assumes you enjoy reinstalling CUDA at midnight. The Java ecosystem mostly… held meetings.", accent: C.coral },
    { i: I.shield, t: "Your data didn't move", b: "It's still in the same databases, behind the same firewall, watched by the same APM agent it was last year.", accent: C.emerald },
    { i: I.bolt,  t: "The gap is just plumbing", b: "Connecting a model to that data is an integration problem. Java has been doing integration problems for 25 years.", accent: C.amber },
  ];
  const cw = (W - 2 * M - 2 * 0.4) / 3;
  cols.forEach((c, idx) => {
    const x = M + idx * (cw + 0.4), y = 2.55, h = 3.7;
    card(s, x, y, cw, h);
    iconChip(s, x + 0.3, y + 0.35, 0.95, c.i, C.cardHi);
    s.addText(c.t, { x: x + 0.3, y: y + 1.45, w: cw - 0.6, h: 0.8, fontFace: FONT_H, fontSize: 17, bold: true,
      color: C.white, align: "left", valign: "top", margin: 0 });
    s.addText(c.b, { x: x + 0.3, y: y + 2.3, w: cw - 0.6, h: h - 2.5, fontFace: FONT_B, fontSize: 13.5,
      color: C.muted, align: "left", valign: "top", margin: 0 });
  });
  s.addNotes(
    "This is the dry-humor opener — keep it deadpan, don't oversell the jokes. " +
    "Beat 1: acknowledge the audience's fatigue honestly; they ARE tired of new frameworks, and pretending otherwise loses them. " +
    "Beat 2: the reframe — the hard part of enterprise AI isn't the model, it's safely connecting it to data you already hold. " +
    "Beat 3: that's an integration problem, and integration is Java's home turf. End on: 'So this isn't revolutionary. It's just convenient — and convenient is underrated.'"
  );
  footer(s, 2);

  // =========================================================
  // SLIDE 3 — THE PROBLEM: hallucination
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// the problem", title: "A language model would rather guess than admit it doesn't know", accent: C.coral, num: 3 });

  // chat mock — the wrong answer
  const cx = M, cy = 2.5, cwBox = 6.1, chBox = 3.9;
  card(s, cx, cy, cwBox, chBox, C.card);
  s.addText([{ text: "  ", options: {} }], { x: cx, y: cy, w: 1, h: 0.1 });
  iconChip(s, cx + 0.3, cy + 0.3, 0.7, I.cross, C.cardHi);
  s.addText("Plain LLM · no retrieval", { x: cx + 1.15, y: cy + 0.3, w: cwBox - 1.4, h: 0.7, fontFace: FONT_B,
    fontSize: 13, color: C.coral, bold: true, align: "left", valign: "middle", margin: 0 });
  // user bubble
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx + 1.9, y: cy + 1.2, w: cwBox - 2.2, h: 0.6, rectRadius: 0.08,
    fill: { color: C.cardHi } });
  s.addText("“What did our June 2026 newsletter announce?”", { x: cx + 2.0, y: cy + 1.2, w: cwBox - 2.4, h: 0.6,
    fontFace: FONT_B, fontSize: 12.5, color: C.ice, align: "left", valign: "middle", margin: 0 });
  // bot bubble (wrong)
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx + 0.3, y: cy + 2.0, w: cwBox - 2.2, h: 1.6, rectRadius: 0.08,
    fill: { color: "2A1822" }, line: { color: C.coral, width: 1 } });
  s.addText([
    { text: "“Your June 2026 newsletter unveiled the ", options: { color: C.ice } },
    { text: "Q3 Synergy Initiative", options: { color: C.coral, bold: true } },
    { text: " and a new ", options: { color: C.ice } },
    { text: "Lisbon office", options: { color: C.coral, bold: true } },
    { text: ".”", options: { color: C.ice } },
  ], { x: cx + 0.5, y: cy + 2.15, w: cwBox - 2.55, h: 1.3, fontFace: FONT_B, fontSize: 13, align: "left", valign: "middle", margin: 0 });
  s.addText("None of that exists. It made it up — fluently.", { x: cx + 0.3, y: cy + 3.55, w: cwBox - 0.6, h: 0.3,
    fontFace: FONT_B, fontSize: 11.5, italic: true, color: C.coral, align: "left", valign: "middle", margin: 0 });

  // right: why it matters
  const rx = M + cwBox + 0.5, rw = W - M - rx;
  s.addText("Why this is a production problem", { x: rx, y: cy + 0.15, w: rw, h: 0.5, fontFace: FONT_H,
    fontSize: 19, bold: true, color: C.white, align: "left", valign: "top", margin: 0 });
  const pts = [
    "It has a training cut-off and never saw your internal data.",
    "It cannot say “I don't know” — fluency is not knowledge.",
    "A support bot inventing a refund policy is a brand incident, not a cute bug.",
  ];
  s.addText(pts.map((t, i) => ({ text: t, options: { bullet: { indent: 18 }, breakLine: true, paraSpaceAfter: 12, color: C.ice } })),
    { x: rx, y: cy + 0.8, w: rw, h: 2.0, fontFace: FONT_B, fontSize: 14.5, align: "left", valign: "top", margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: rx, y: cy + 3.05, w: rw, h: 0.85, rectRadius: 0.08,
    fill: { color: C.panel }, line: { color: C.emerald, width: 1 } });
  s.addText([
    { text: "The fix isn't a smarter model. ", options: { color: C.muted } },
    { text: "It's giving this one the answer key.", options: { color: C.emerald, bold: true } },
  ], { x: rx + 0.25, y: cy + 3.05, w: rw - 0.5, h: 0.85, fontFace: FONT_B, fontSize: 14, align: "left", valign: "middle", margin: 0 });
  s.addNotes(
    "Show, don't tell. Read the invented answer aloud in a confident voice, then deadpan: 'Every word of that is fiction, delivered with total confidence.' " +
    "Make the stakes concrete with the support-bot line — that's the moment a skeptical enterprise audience leans in. " +
    "The punchline sets up RAG without naming it yet: we don't need a smarter model, we need to hand this one the relevant facts at question time. " +
    "In the live demo this is exactly the /ask/no-rag endpoint."
  );
  footer(s, 3);

  // =========================================================
  // SLIDE 4 — RAG DEFINED
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// the idea", title: "Retrieval-Augmented Generation", accent: C.emerald, num: 4 });
  s.addText("Look up the relevant facts first. Then let the model write the answer using them.", {
    x: M, y: 1.74, w: 11.4, h: 0.5, fontFace: FONT_B, fontSize: 15, italic: true, color: C.muted, margin: 0 });

  // big analogy panel
  card(s, M, 2.55, 6.0, 3.7, C.card);
  iconChip(s, M + 0.35, 2.9, 1.0, I.book, C.cardHi);
  s.addText("The open-book exam", { x: M + 0.35, y: 4.0, w: 5.3, h: 0.5, fontFace: FONT_H, fontSize: 20,
    bold: true, color: C.white, align: "left", valign: "top", margin: 0 });
  s.addText([
    { text: "A closed-book LLM bluffs from memory. ", options: { color: C.ice } },
    { text: "RAG hands it the page with the answer on it ", options: { color: C.emerald } },
    { text: "before it starts writing. Same model — now it's quoting, not guessing.", options: { color: C.ice } },
  ], { x: M + 0.35, y: 4.55, w: 5.35, h: 1.5, fontFace: FONT_B, fontSize: 15, align: "left", valign: "top", margin: 0 });

  // right: the three moving parts
  const parts = [
    { t: "Retrieve", b: "Search your documents for the chunks most relevant to the question.", a: C.emerald },
    { t: "Augment", b: "Paste those chunks into the prompt, alongside the user's question.", a: C.amber },
    { t: "Generate", b: "The model answers from the supplied context — grounded, not guessed.", a: C.coral },
  ];
  const px = M + 6.5, pw = W - M - px;
  parts.forEach((p, i) => {
    const y = 2.55 + i * 1.27;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y, w: pw, h: 1.12, rectRadius: 0.08,
      fill: { color: C.card }, line: { color: C.line, width: 1 }, shadow: shadow() });
    s.addShape(pres.shapes.OVAL, { x: px + 0.25, y: y + 0.31, w: 0.5, h: 0.5, fill: { color: p.a } });
    s.addText(p.t[0], { x: px + 0.25, y: y + 0.31, w: 0.5, h: 0.5, align: "center", valign: "middle",
      fontFace: FONT_H, fontSize: 18, bold: true, color: C.bg, margin: 0 });
    s.addText(p.t, { x: px + 0.95, y: y + 0.16, w: pw - 1.1, h: 0.4, fontFace: FONT_H, fontSize: 16, bold: true,
      color: C.white, align: "left", valign: "middle", margin: 0 });
    s.addText(p.b, { x: px + 0.95, y: y + 0.52, w: pw - 1.2, h: 0.5, fontFace: FONT_B, fontSize: 12.5,
      color: C.muted, align: "left", valign: "top", margin: 0 });
  });
  s.addNotes(
    "Define the acronym in plain words before any diagram. The open-book-exam analogy is the one people remember — lead with it. " +
    "Stress that the model itself doesn't change; what changes is the prompt it receives. That reframing matters for the skeptics: there's no fine-tuning, no retraining, no GPU farm. " +
    "Retrieve / Augment / Generate are literally the R-A-G; name them so the next slide's pipeline feels inevitable."
  );
  footer(s, 4);

  // =========================================================
  // SLIDE 5 — HOW RAG WORKS (native pipeline)
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// the pipeline", title: "Two phases: ingest once, then retrieve on every question", accent: C.emerald, num: 5 });

  // phase labels
  s.addText("INGESTION  ·  at startup", { x: M, y: 1.85, w: 5, h: 0.3, fontFace: FONT_M, fontSize: 11,
    color: C.amber, bold: true, charSpacing: 1, margin: 0 });
  s.addText("QUERY  ·  per request", { x: 7.0, y: 1.85, w: 5, h: 0.3, fontFace: FONT_M, fontSize: 11,
    color: C.emerald, bold: true, charSpacing: 1, margin: 0 });

  const sbW = 2.78, sbH = 2.55, gap = 0.33, topY = 2.25;
  stepBox(s, M, topY, sbW, sbH, 1, "Split & embed", "Chop documents into chunks; turn each into a vector with an embedding model.", C.amber);
  stepBox(s, M + (sbW + gap), topY, sbW, sbH, 2, "Store", "Keep the vectors in an embedding store — in-memory for the demo, pgvector in prod.", C.amber);
  // arrow between phases
  s.addShape(pres.shapes.LINE, { x: M + 2 * (sbW + gap) - 0.05, y: topY + sbH / 2, w: gap + 0.1, h: 0,
    line: { color: C.line, width: 1.5, endArrowType: "triangle" } });
  stepBox(s, 7.0, topY, sbW, sbH, 3, "Embed the question", "The user's question goes through the same embedding model to a vector.", C.emerald);
  stepBox(s, 7.0 + (sbW + gap), topY, sbW, sbH, 4, "Similarity search", "Find the nearest chunks in vector space — semantic match, not keyword match.", C.emerald);

  // step 5 full-width result bar
  const fy = topY + sbH + 0.35;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: fy, w: W - 2 * M, h: 0.95, rectRadius: 0.08,
    fill: { color: C.panel }, line: { color: C.emerald, width: 1 }, shadow: shadow() });
  s.addShape(pres.shapes.OVAL, { x: M + 0.3, y: fy + 0.22, w: 0.5, h: 0.5, fill: { color: C.emerald } });
  s.addText("5", { x: M + 0.3, y: fy + 0.22, w: 0.5, h: 0.5, align: "center", valign: "middle", fontFace: FONT_H,
    fontSize: 18, bold: true, color: C.bg, margin: 0 });
  s.addText([
    { text: "Inject + generate   ", options: { color: C.white, bold: true } },
    { text: "the retrieved chunks are pasted into the prompt, and the model answers from them — citing your data instead of inventing it.",
      options: { color: C.ice } },
  ], { x: M + 1.0, y: fy, w: W - 2 * M - 1.3, h: 0.95, fontFace: FONT_B, fontSize: 14, align: "left", valign: "middle", margin: 0 });

  s.addText("A polished version of this diagram ships separately as assets/rag-pipeline.svg", {
    x: M, y: H - 0.78, w: 9, h: 0.3, fontFace: FONT_B, fontSize: 9.5, italic: true, color: C.line, align: "left", margin: 0 });
  s.addNotes(
    "The single most important conceptual slide. Walk the two phases distinctly. " +
    "Ingestion happens once at startup and is the expensive part; querying happens per request and is cheap. " +
    "The key insight non-ML people miss: retrieval is by MEANING, not keywords — 'time off' can match 'holiday policy' because they're near each other in vector space. " +
    "Don't get academic about embeddings; one sentence ('text in, vector out, similar meanings land close together') is enough. " +
    "Mention the offloaded SVG is available if they want to reuse the diagram elsewhere."
  );
  footer(s, 5);

  // =========================================================
  // SLIDE 6 — WHY LANGCHAIN4J
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// the choice", title: "Why LangChain4j, not the managed “RAG” button", accent: C.emerald, num: 6 });

  const lc = [
    { i: I.unlock, t: "You own the retrieval", b: "Chunking, embeddings, how context is injected — all yours to tune. Managed RAG hides exactly the parts you'll need to fix.", a: C.emerald },
    { i: I.layers, t: "No vendor lock-in", b: "OpenAI, Azure, Gemini, Anthropic, Ollama — swap the provider in config. Your code doesn't notice.", a: C.amber },
    { i: I.code,  t: "It's just Java", b: "Same language, build, and test story as the rest of your stack. Framework-agnostic — it runs inside Spring too.", a: C.coral },
  ];
  const lw = (W - 2 * M - 2 * 0.4) / 3;
  lc.forEach((c, idx) => {
    const x = M + idx * (lw + 0.4), y = 2.5, h = 3.0;
    card(s, x, y, lw, h);
    iconChip(s, x + 0.3, y + 0.32, 0.9, c.i, C.cardHi);
    s.addText(c.t, { x: x + 0.3, y: y + 1.35, w: lw - 0.6, h: 0.5, fontFace: FONT_H, fontSize: 16.5, bold: true,
      color: C.white, align: "left", valign: "top", margin: 0 });
    s.addText(c.b, { x: x + 0.3, y: y + 1.9, w: lw - 0.6, h: h - 2.1, fontFace: FONT_B, fontSize: 13,
      color: C.muted, align: "left", valign: "top", margin: 0 });
  });
  // spring-ai aside
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.8, w: W - 2 * M, h: 0.85, rectRadius: 0.08,
    fill: { color: C.panel }, line: { color: C.line, width: 1 } });
  s.addText([
    { text: "“What about Spring AI?”   ", options: { color: C.coral, bold: true } },
    { text: "Different project, not a competitor for this talk. It's Spring-specific; LangChain4j is framework-agnostic and works inside Spring Boot too. Pick by where you want the flexibility.", options: { color: C.ice } },
  ], { x: M + 0.3, y: 5.8, w: W - 2 * M - 0.6, h: 0.85, fontFace: FONT_B, fontSize: 13, align: "left", valign: "middle", margin: 0 });
  s.addNotes(
    "This is the 'why not just click the cloud vendor's RAG checkbox' slide. The honest answer: managed RAG is great until you need to change how retrieval works — and you always need to change how retrieval works. " +
    "Lead with ownership and lock-in; those are the two that survive procurement review. " +
    "Handle the Spring AI question pre-emptively — someone will ask. Be fair to Spring AI, don't trash it; the point is framework-agnostic flexibility, and that LangChain4j can live inside Spring too, so it's not an either/or religious choice."
  );
  footer(s, 6);

  // =========================================================
  // SLIDE 7 — WHY QUARKUS
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// the runtime", title: "Why Quarkus — and why JVM mode is the boring, correct default", accent: C.coral, num: 7 });

  const qx = M, qw = 6.1;
  const ql = [
    { t: "Sub-second start + live reload", b: "Edit code, save, re-curl — the change is just there. This is what makes the live demo survive." },
    { t: "Familiar to JEE / Spring teams", b: "CDI, JAX-RS, the annotations you know. The migration path is short, not a rewrite." },
    { t: "Dev Services", b: "Spins up dependencies (databases, etc.) automatically in dev — less yak-shaving before you see output." },
  ];
  s.addText("The developer-experience case", { x: qx, y: 2.45, w: qw, h: 0.4, fontFace: FONT_H, fontSize: 17,
    bold: true, color: C.emerald, align: "left", valign: "top", margin: 0 });
  ql.forEach((c, i) => {
    const y = 2.95 + i * 1.12;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: qx, y, w: qw, h: 1.0, rectRadius: 0.08, fill: { color: C.card },
      line: { color: C.line, width: 1 }, shadow: shadow() });
    iconChip(s, qx + 0.25, y + 0.27, 0.46, I.bolt, C.cardHi);
    s.addText(c.t, { x: qx + 0.9, y: y + 0.14, w: qw - 1.1, h: 0.35, fontFace: FONT_H, fontSize: 14.5, bold: true,
      color: C.white, align: "left", valign: "middle", margin: 0 });
    s.addText(c.b, { x: qx + 0.9, y: y + 0.5, w: qw - 1.1, h: 0.45, fontFace: FONT_B, fontSize: 12,
      color: C.muted, align: "left", valign: "top", margin: 0 });
  });

  // right: JVM vs native honesty box
  const nx = M + qw + 0.5, nw = W - M - nx;
  s.addText("Native image? Only if you need it", { x: nx, y: 2.45, w: nw, h: 0.4, fontFace: FONT_H, fontSize: 17,
    bold: true, color: C.amber, align: "left", valign: "top", margin: 0 });
  card(s, nx, 2.95, nw, 3.36, C.card);
  s.addText([
    { text: "JVM mode", options: { color: C.emerald, bold: true } },
    { text: "  — traditional JAR, standard OpenJDK. Faster to start than Spring Boot, and your ", options: { color: C.ice } },
    { text: "Elastic APM agent attaches exactly as it does today.", options: { color: C.emerald } },
    { text: "  Ship this.", options: { color: C.white, bold: true, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Native image", options: { color: C.amber, bold: true } },
    { text: "  — ~50 ms start, tiny memory, for serverless / aggressive autoscaling. Trades away the APM Java agent (use OpenTelemetry instead) and easy JVM debugging.", options: { color: C.ice } },
  ], { x: nx + 0.3, y: 3.2, w: nw - 0.6, h: 2.9, fontFace: FONT_B, fontSize: 14, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.1 });
  s.addNotes(
    "Pre-empt the biggest misconception: people think Quarkus means native images and a whole new ops model. It doesn't. " +
    "JVM mode is a normal JAR on standard OpenJDK — and crucially the Elastic APM Java agent attaches the same way it does to their Spring apps today. That single fact is what makes this palatable to a conservative DevOps team. " +
    "Native image is a tool for a specific job (serverless, scale-to-zero), not a requirement. Say plainly: 'For most of you, ship the JAR. Native is there if you ever need it.' " +
    "Live-reload is the developer hook — and it's what makes the demo feel like magic without being magic."
  );
  footer(s, 7);

  // =========================================================
  // SLIDE 8 — STACK AT A GLANCE (native architecture)
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// the architecture", title: "The whole thing fits on one slide", accent: C.emerald, num: 8 });

  function archBox(x, y, w, h, title, sub, accent, iconData) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: C.card },
      line: { color: accent, width: 1.5 }, shadow: shadow() });
    if (iconData) { s.addImage({ data: iconData, x: x + 0.22, y: y + h/2 - 0.24, w: 0.48, h: 0.48 }); }
    s.addText(title, { x: x + (iconData ? 0.85 : 0.25), y: y + 0.16, w: w - (iconData ? 1.0 : 0.4), h: 0.4,
      fontFace: FONT_H, fontSize: 14.5, bold: true, color: C.white, align: "left", valign: "middle", margin: 0 });
    s.addText(sub, { x: x + (iconData ? 0.85 : 0.25), y: y + 0.56, w: w - (iconData ? 1.0 : 0.4), h: 0.5,
      fontFace: FONT_M, fontSize: 10.5, color: C.muted, align: "left", valign: "top", margin: 0 });
  }
  function arrow(x, y, w) {
    s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color: C.muted, width: 1.5, endArrowType: "triangle" } });
  }

  const ay = 2.7;
  archBox(M, ay, 2.5, 1.15, "Browser / curl", "POST /ask/*", C.ice, I.terminal);
  arrow(M + 2.5, ay + 0.57, 0.5);
  archBox(M + 3.0, ay, 2.7, 1.15, "Quarkus REST", "JAX-RS resource", C.coral, I.bolt);
  arrow(M + 5.7, ay + 0.57, 0.5);
  archBox(M + 6.2, ay, 2.9, 1.15, "LangChain4j AiService", "@RegisterAiService", C.emerald, I.robot);

  // down to retriever + augmentor
  s.addShape(pres.shapes.LINE, { x: M + 7.65, y: ay + 1.15, w: 0, h: 0.55, line: { color: C.muted, width: 1.5, endArrowType: "triangle" } });
  const by = ay + 1.95;
  archBox(M + 3.0, by, 2.9, 1.15, "Retrieval Augmentor", "retrieve + inject", C.emerald, I.diagram);
  arrow(M + 5.9, by + 0.57, 0.5);
  archBox(M + 6.4, by, 3.1, 1.15, "Embedding store", "in-memory · pgvector", C.amber, I.layers);

  // LLM provider off to the right
  archBox(M + 9.4, ay, W - M - (M + 9.4), 1.15, "LLM provider", "OpenAI · Azure · Ollama", C.coral, I.cloud);
  s.addShape(pres.shapes.LINE, { x: M + 9.1, y: ay + 0.57, w: 0.3, h: 0, line: { color: C.muted, width: 1.5, endArrowType: "triangle" } });

  // embeddings/PDF source feeding the store
  archBox(M + 9.7, by, W - M - (M + 9.7), 1.15, "Newsletter PDFs", "src/main/resources/rag", C.ice, I.book);
  s.addShape(pres.shapes.LINE, { x: M + 9.5, y: by + 0.57, w: 0.2, h: 0, line: { color: C.muted, width: 1.5, endArrowType: "triangle" } });

  // observability strip
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: by + 1.55, w: W - 2 * M, h: 0.9, rectRadius: 0.08,
    fill: { color: C.panel }, line: { color: C.line, width: 1 } });
  s.addImage({ data: I.chart, x: M + 0.3, y: by + 1.78, w: 0.45, h: 0.45 });
  s.addText([
    { text: "Wrapped by the JVM, watched by your Elastic APM agent.  ", options: { color: C.ice, bold: true } },
    { text: "Every box above is a traced span — no new observability stack required.", options: { color: C.muted } },
  ], { x: M + 0.95, y: by + 1.55, w: W - 2 * M - 1.2, h: 0.9, fontFace: FONT_B, fontSize: 13, align: "left", valign: "middle", margin: 0 });

  s.addNotes(
    "Trace one request end to end with your finger: curl hits the JAX-RS resource, which calls the AiService; the augmentor retrieves chunks from the embedding store and injects them; the call goes to the LLM provider; the answer comes back. " +
    "Then point at the bottom strip — the entire thing runs inside one JVM, so the Elastic APM agent they already run sees every hop as a span. That's the 'no new infrastructure' promise made literal. " +
    "Note the two swappable boxes (store and provider) — that's tomorrow's slide. The offloaded architecture.svg is the cleaner asset for docs."
  );
  footer(s, 8);

  // =========================================================
  // SLIDE 9 — LANGCHAIN4J IN FIVE LINES
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// the code", title: "An AI service is an interface. That's the whole ceremony.", accent: C.emerald, num: 9 });

  codePanel(s, M, 2.45, 6.4, 3.7, [
    br(cm("// Declare what you want. Quarkus implements it.")),
    br(an("@RegisterAiService")),
    { text: "", options: { breakLine: true } },
    br(pl("public interface Assistant {")),
    { text: "", options: { breakLine: true } },
    br(pl("    String chat(String question);")),
    br(pl("}")),
    { text: "", options: { breakLine: true } },
    br(cm("// Inject it like any other bean:")),
    br(pl("@Inject Assistant assistant;")),
    br({ text: 'assistant.chat("Hello?");', options: { color: C.ice } }),
  ], { file: "Assistant.java", fontSize: 14 });

  const fx = M + 6.8, fw = W - M - fx;
  s.addText("What you did NOT write", { x: fx, y: 2.5, w: fw, h: 0.45, fontFace: FONT_H, fontSize: 18, bold: true,
    color: C.white, align: "left", valign: "top", margin: 0 });
  const noWrite = [
    "No HTTP client for the model API",
    "No JSON request/response plumbing",
    "No retry / timeout boilerplate",
    "No prompt string concatenation in your resource",
  ];
  noWrite.forEach((t, i) => {
    const y = 3.1 + i * 0.62;
    s.addImage({ data: I.check, x: fx, y: y + 0.02, w: 0.32, h: 0.32 });
    s.addText(t, { x: fx + 0.5, y, w: fw - 0.5, h: 0.5, fontFace: FONT_B, fontSize: 14, color: C.ice,
      align: "left", valign: "middle", margin: 0 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: fx, y: 5.75, w: fw, h: 0.85, rectRadius: 0.08, fill: { color: C.panel },
    line: { color: C.emerald, width: 1 } });
  s.addText([
    { text: "The model config (key, model name, temperature) lives in ", options: { color: C.muted } },
    { text: "application.properties", options: { color: C.emerald, bold: true } },
    { text: " — not in code.", options: { color: C.muted } },
  ], { x: fx + 0.25, y: 5.75, w: fw - 0.5, h: 0.85, fontFace: FONT_B, fontSize: 13, align: "left", valign: "middle", margin: 0 });
  s.addNotes(
    "The reveal here is how little there is. An interface plus an annotation IS the integration — Quarkus generates the implementation at build time. " +
    "Contrast with what they'd expect from a typical SDK integration: HTTP client, serialization, retries, error handling. All gone. " +
    "Emphasize config-over-code: the API key and model name are properties, so swapping gpt-4o-mini for a local Ollama model is a config change, not a code change. This is the lock-in argument made tangible. " +
    "Note this slide has NO RAG yet — it's the plain model. RAG is the next move."
  );
  footer(s, 9);

  // =========================================================
  // SLIDE 10 — RAG FOUR WAYS (the demo spine)
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// the demo spine", title: "The same question, answered four ways", accent: C.coral, num: 10 });
  s.addText("Four endpoints, one corpus of company newsletters. Watch what each layer buys you.", {
    x: M, y: 1.74, w: 11.4, h: 0.5, fontFace: FONT_B, fontSize: 15, italic: true, color: C.muted, margin: 0 });

  const rows = [
    { n: "01", e: "/ask/no-rag", t: "No retrieval", b: "Raw model call. Hallucinates confidently. The “before”.", a: C.coral, ic: I.cross },
    { n: "02", e: "/ask/naive-rag", t: "RAG by hand", b: "Retriever + augmentor wired explicitly. Shows what RAG actually is.", a: C.emerald, ic: I.wrench },
    { n: "03", e: "/ask/easy-rag", t: "RAG by config", b: "Same answer, the wiring deleted. Three properties, zero RAG code.", a: C.amber, ic: I.magic },
    { n: "04", e: "/ask/transformed-rag", t: "RAG, tuned", b: "Rewrites a vague question before retrieving. The first knob you turn.", a: C.ice, ic: I.sync },
  ];
  const ry0 = 2.5, rh = 0.93, rgap = 0.12;
  rows.forEach((r, i) => {
    const y = ry0 + i * (rh + rgap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y, w: W - 2 * M, h: rh, rectRadius: 0.08,
      fill: { color: C.card }, line: { color: C.line, width: 1 }, shadow: shadow() });
    s.addText(r.n, { x: M + 0.25, y, w: 0.8, h: rh, align: "center", valign: "middle", fontFace: FONT_H,
      fontSize: 26, bold: true, color: r.a, margin: 0 });
    iconChip(s, M + 1.2, y + rh/2 - 0.28, 0.56, r.ic, C.cardHi);
    s.addText(r.e, { x: M + 2.0, y, w: 3.4, h: rh, fontFace: FONT_M, fontSize: 15, bold: true, color: C.white,
      align: "left", valign: "middle", margin: 0 });
    s.addText(r.t, { x: M + 5.4, y, w: 2.5, h: rh, fontFace: FONT_H, fontSize: 15, bold: true, color: r.a,
      align: "left", valign: "middle", margin: 0 });
    s.addText(r.b, { x: M + 7.8, y, w: W - 2 * M - 8.0, h: rh, fontFace: FONT_B, fontSize: 12.5, color: C.muted,
      align: "left", valign: "middle", margin: 0 });
  });
  s.addNotes(
    "This is the map for the entire demo — put it up and tell them 'we're going to hit these four endpoints with the identical question and watch the answer change.' " +
    "The newsletters matter: a generic model has zero chance of knowing what's in your internal newsletter, so the no-rag failure is unambiguous, not a coin-flip. " +
    "01 is the problem; 02 shows the mechanism; 03 shows the ergonomics; 04 shows you can tune it when naive retrieval misses. Tell them you'll return to this slide between demo steps so nobody gets lost."
  );
  footer(s, 10);

  // =========================================================
  // SLIDE 11 — NAIVE RAG (wiring exposed)
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// 02 · rag by hand", title: "Naive RAG: the wiring, fully exposed", accent: C.emerald, num: 11 });

  codePanel(s, M, 2.45, 7.4, 4.0, [
    br(cm("// 1 — a retriever over your embedding store")),
    br({ text: "var retriever = EmbeddingStoreContentRetriever.builder()", options: { color: C.ice } }),
    br(pl("    .embeddingStore(store).embeddingModel(model)")),
    br(pl("    .maxResults(3).build();")),
    { text: " ", options: { breakLine: true } },
    br(cm("// 2 — an augmentor that injects what it finds")),
    br({ text: "return DefaultRetrievalAugmentor.builder()", options: { color: C.ice } }),
    br(pl("    .contentRetriever(retriever)")),
    br(pl("    .contentInjector(/* paste chunks into prompt */)")),
    br(pl("    .build();")),
  ], { file: "NaiveRagAugmentorSupplier.java", fontSize: 12.5 });

  const ix = M + 7.8, iw = W - M - ix;
  s.addText("Read this once", { x: ix, y: 2.5, w: iw, h: 0.45, fontFace: FONT_H, fontSize: 18, bold: true,
    color: C.white, align: "left", valign: "top", margin: 0 });
  s.addText([
    { text: "This is the entire trick. ", options: { color: C.emerald, bold: true, breakLine: true } },
    { text: "A retriever finds relevant chunks; an injector pastes them into the prompt. No framework is hiding anything subtle from you.", options: { color: C.ice, breakLine: true } },
    { text: "\n", options: { breakLine: true } },
    { text: "Worth showing the audience once — then never typing again, because of the next slide.", options: { color: C.muted, italic: true } },
  ], { x: ix, y: 3.05, w: iw, h: 3.2, fontFace: FONT_B, fontSize: 14.5, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.12 });
  s.addNotes(
    "Demo step 2. The teaching goal: demystify RAG by showing there's no magic — retriever plus injector, both readable. " +
    "Don't read every line; point at the two comments ('find relevant chunks' / 'paste them into the prompt') — that's the mental model. " +
    "Then set up the punchline for the next slide: 'This is good to understand once. Now watch how much of it you can delete.' " +
    "In the live app this is /ask/naive-rag and it returns the correct, grounded answer the no-rag endpoint failed."
  );
  footer(s, 11);

  // =========================================================
  // SLIDE 12 — EASY RAG (wiring deleted)
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// 03 · rag by config", title: "Easy RAG: same answer, the code deleted", accent: C.amber, num: 12 });

  // left: the interface (empty)
  codePanel(s, M, 2.45, 5.6, 1.9, [
    br(an("@RegisterAiService")),
    br(pl("public interface EasyRagAiService {")),
    br(pl("    String chat(String question);")),
    br(pl("}")),
    br(cm("// ↑ no retrieval code at all")),
  ], { file: "EasyRagAiService.java", fontSize: 13 });

  // left-bottom: the config
  codePanel(s, M, 4.55, 5.6, 1.95, [
    br({ text: "quarkus.langchain4j.easy-rag.path=", options: { color: C.ice } }),
    br(str("  src/main/resources/rag")),
    br({ text: "quarkus.langchain4j.easy-rag.max-results=", options: { color: C.ice } }),
    br(an("  3")),
  ], { file: "application.properties", fontSize: 12.5 });

  // right: what the extension did for you
  const ex = M + 6.0, ew = W - M - ex;
  s.addText("The extension did the rest", { x: ex, y: 2.5, w: ew, h: 0.45, fontFace: FONT_H, fontSize: 18, bold: true,
    color: C.white, align: "left", valign: "top", margin: 0 });
  const did = [
    "Scanned the folder, parsed every PDF (Apache Tika)",
    "Chunked + embedded them into an in-memory store",
    "Built a default retriever and wired it to your service",
  ];
  did.forEach((t, i) => {
    const y = 3.1 + i * 0.72;
    s.addImage({ data: I.check, x: ex, y: y + 0.03, w: 0.32, h: 0.32 });
    s.addText(t, { x: ex + 0.5, y, w: ew - 0.5, h: 0.6, fontFace: FONT_B, fontSize: 14, color: C.ice,
      align: "left", valign: "middle", margin: 0 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ex, y: 5.5, w: ew, h: 1.0, rectRadius: 0.08, fill: { color: C.panel },
    line: { color: C.amber, width: 1 } });
  s.addText([
    { text: "Slide 11's wiring, replaced by one path. ", options: { color: C.amber, bold: true } },
    { text: "Great default — until you need to tune retrieval. Then you reach back for the explicit version.", options: { color: C.ice } },
  ], { x: ex + 0.25, y: 5.5, w: ew - 0.5, h: 1.0, fontFace: FONT_B, fontSize: 13.5, align: "left", valign: "middle", margin: 0 });
  s.addNotes(
    "Demo step 3, and the biggest 'oh' of the talk. Put this next to slide 11 mentally: all that builder code became one config property. " +
    "Hit /ask/easy-rag with the SAME question — identical grounded answer, none of the wiring. " +
    "The honest caveat keeps you credible: easy-rag is a fantastic on-ramp and a fine default, but it hides knobs. When naive retrieval gives a bad answer (next slide), you drop back to the explicit augmentor. " +
    "This is the modernization beat too: the old workshop needed a separate embeddings dependency and manual ingestion code; today it's an extension plus a path."
  );
  footer(s, 12);

  // =========================================================
  // SLIDE 13 — QUERY TRANSFORMATION
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// 04 · rag, tuned", title: "When retrieval misses, fix the question — not the model", accent: C.ice, num: 13 });

  // before/after of a vague query
  const bw = 5.7;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 2.5, w: bw, h: 1.7, rectRadius: 0.08, fill: { color: "2A1822" },
    line: { color: C.coral, width: 1 }, shadow: shadow() });
  s.addText("Vague question → weak retrieval", { x: M + 0.3, y: 2.65, w: bw - 0.6, h: 0.4, fontFace: FONT_H,
    fontSize: 14, bold: true, color: C.coral, align: "left", valign: "top", margin: 0 });
  s.addText("“What about the time-off thing they mentioned?”", { x: M + 0.3, y: 3.1, w: bw - 0.6, h: 0.5,
    fontFace: FONT_B, fontSize: 14, italic: true, color: C.ice, align: "left", valign: "top", margin: 0 });
  s.addText("Embeds to a fuzzy vector — nearest chunks are off-target. The model gets bad context, gives a bad answer.",
    { x: M + 0.3, y: 3.55, w: bw - 0.6, h: 0.6, fontFace: FONT_B, fontSize: 12, color: C.muted, align: "left", valign: "top", margin: 0 });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 4.4, w: bw, h: 1.95, rectRadius: 0.08, fill: { color: C.card },
    line: { color: C.emerald, width: 1 }, shadow: shadow() });
  s.addText("A transformer rewrites it first", { x: M + 0.3, y: 4.55, w: bw - 0.6, h: 0.4, fontFace: FONT_H,
    fontSize: 14, bold: true, color: C.emerald, align: "left", valign: "top", margin: 0 });
  s.addText("“What is the company's paid time-off / holiday policy?”", { x: M + 0.3, y: 5.0, w: bw - 0.6, h: 0.5,
    fontFace: FONT_B, fontSize: 14, italic: true, color: C.ice, align: "left", valign: "top", margin: 0 });
  s.addText("Sharper vector → the right chunks come back → the answer recovers. Same documents, same model.",
    { x: M + 0.3, y: 5.45, w: bw - 0.6, h: 0.8, fontFace: FONT_B, fontSize: 12, color: C.muted, align: "left", valign: "top", margin: 0 });

  // right: the one-line change
  const tx = M + bw + 0.5, tw = W - M - tx;
  codePanel(s, tx, 2.5, tw, 1.95, [
    br(cm("// one extra builder call:")),
    br({ text: "DefaultRetrievalAugmentor.builder()", options: { color: C.ice } }),
    br({ text: "  .queryTransformer(", options: { color: C.ice } }),
    br({ text: "      new ", options: { color: C.ice } }),
    br(an("        CompressingQueryTransformer(model))")),
    br(pl("  .contentRetriever(retriever)...")),
  ], { file: "TransformedRagAugmentorSupplier.java", fontSize: 11.5 });
  s.addText("Knobs you reach for, in order", { x: tx, y: 4.65, w: tw, h: 0.4, fontFace: FONT_H, fontSize: 15,
    bold: true, color: C.white, align: "left", valign: "top", margin: 0 });
  s.addText([
    { text: "1.  Rewrite the query  ", options: { color: C.emerald, bold: true } },
    { text: "(this slide — cheap, no extra service)", options: { color: C.muted, breakLine: true } },
    { text: "2.  Tune chunk size / maxResults  ", options: { color: C.ice, bold: true } },
    { text: "(config)", options: { color: C.muted, breakLine: true } },
    { text: "3.  Add a reranker  ", options: { color: C.ice, bold: true } },
    { text: "(a scoring model — more cost)", options: { color: C.muted } },
  ], { x: tx, y: 5.1, w: tw, h: 1.3, fontFace: FONT_B, fontSize: 12.5, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15 });
  s.addNotes(
    "Demo step 4, and the 'RAG is not one thing' payoff. First hit /ask/naive-rag with the deliberately vague question and let it whiff — that honesty buys credibility. Then hit /ask/transformed-rag with the SAME vague question and watch it recover. " +
    "The point: the failure mode of naive RAG is usually the QUESTION, not the model — and the cheapest fix is to rewrite the question before embedding it. " +
    "The ladder on the right tells them what to try and in what order, so they leave with a debugging procedure, not just a demo. Reranking is named but deliberately out of scope (needs a paid scoring model)."
  );
  footer(s, 13);

  // =========================================================
  // SLIDE 14 — LIVE DEMO
  // =========================================================
  s = pres.addSlide(); base(s);
  // dark dramatic demo slide
  s.addText("LIVE", { x: 7.4, y: -0.5, w: 6.0, h: 3.6, align: "right", fontFace: FONT_H, fontSize: 150, bold: true,
    color: C.panel, margin: 0 });
  s.addText("// demo", { x: M, y: 0.9, w: 6, h: 0.4, fontFace: FONT_M, fontSize: 14, color: C.emerald, bold: true,
    charSpacing: 2, margin: 0 });
  s.addText("Now the part that can go wrong on purpose", { x: M, y: 1.35, w: 11.6, h: 1.0, fontFace: FONT_H,
    fontSize: 36, bold: true, color: C.white, margin: 0 });

  const demoSteps = [
    { n: "1", t: "Ask with no RAG", b: "Confident fiction about the newsletter.", a: C.coral },
    { n: "2", t: "Ask with naive RAG", b: "Same question — now grounded and correct.", a: C.emerald },
    { n: "3", t: "Swap to easy RAG", b: "Identical answer; show the config that replaced the code.", a: C.amber },
    { n: "4", t: "Break it, then fix it", b: "Vague question whiffs on naive; query-transform recovers.", a: C.ice },
  ];
  const dw = (W - 2 * M - 3 * 0.35) / 4;
  demoSteps.forEach((d, i) => {
    const x = M + i * (dw + 0.35), y = 2.75, h = 2.55;
    card(s, x, y, dw, h);
    s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.25, w: 0.6, h: 0.6, fill: { color: d.a } });
    s.addText(d.n, { x: x + 0.25, y: y + 0.25, w: 0.6, h: 0.6, align: "center", valign: "middle", fontFace: FONT_H,
      fontSize: 22, bold: true, color: C.bg, margin: 0 });
    s.addText(d.t, { x: x + 0.25, y: y + 1.0, w: dw - 0.5, h: 0.7, fontFace: FONT_H, fontSize: 15, bold: true,
      color: C.white, align: "left", valign: "top", margin: 0 });
    s.addText(d.b, { x: x + 0.25, y: y + 1.65, w: dw - 0.5, h: h - 1.8, fontFace: FONT_B, fontSize: 12.5,
      color: C.muted, align: "left", valign: "top", margin: 0 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.6, w: W - 2 * M, h: 0.95, rectRadius: 0.08,
    fill: { color: C.panel }, line: { color: C.line, width: 1 } });
  s.addImage({ data: I.terminal, x: M + 0.3, y: 5.83, w: 0.5, h: 0.5 });
  s.addText([
    { text: "mvn quarkus:dev", options: { color: C.emerald, bold: true, fontFace: FONT_M } },
    { text: "   — hot reload stays on the whole time. If it crashes, I have a 15-minute panic window and a pre-recorded backup.", options: { color: C.ice, fontFace: FONT_B } },
  ], { x: M + 1.0, y: 5.6, w: W - 2 * M - 1.3, h: 0.95, fontSize: 14, align: "left", valign: "middle", margin: 0 });
  s.addNotes(
    "The star of the talk. Keep the four beats tight and always return to slide 10 between them so the audience tracks where you are. " +
    "Pacing: step 1 and 2 back to back is the money shot — wrong answer, then right answer, same question. Let the contrast breathe. " +
    "Step 3 is the ergonomics reveal; step 4 is the 'RAG needs tuning' reveal. " +
    "Practical: set OPENAI_API_KEY beforehand, have the dev server already warm, and have the backup recording one Alt-Tab away. The self-deprecating 'panic window' line both gets a laugh and quietly sets expectations if the Wi-Fi betrays you. " +
    "Known gotcha on the demo machine: a local Netty loopback/VPN issue and the easy-rag Docker dev-card can block startup — start the server before the session, don't cold-start it on stage."
  );
  footer(s, 14);

  // =========================================================
  // SLIDE 15 — OBSERVABILITY
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// observability", title: "Same tools you already own, watching new traffic", accent: C.emerald, num: 15 });
  s.addText("The pitch to a conservative DevOps team: nothing new to operate.", {
    x: M, y: 1.74, w: 11.4, h: 0.5, fontFace: FONT_B, fontSize: 15, italic: true, color: C.muted, margin: 0 });

  // two columns: JVM mode vs native
  const ow = 5.85;
  card(s, M, 2.55, ow, 3.8, C.card);
  iconChip(s, M + 0.3, 2.85, 0.85, I.shield, C.cardHi);
  s.addText("JVM mode  ·  what you'll do", { x: M + 1.3, y: 2.95, w: ow - 1.5, h: 0.6, fontFace: FONT_H, fontSize: 17,
    bold: true, color: C.emerald, align: "left", valign: "middle", margin: 0 });
  s.addText([
    { text: "Attach the Elastic APM Java agent ", options: { color: C.ice, bold: true } },
    { text: "exactly as you do on your Spring apps today:", options: { color: C.muted, breakLine: true } },
  ], { x: M + 0.35, y: 3.8, w: ow - 0.7, h: 0.6, fontFace: FONT_B, fontSize: 13.5, align: "left", valign: "top", margin: 0 });
  codePanel(s, M + 0.35, 4.45, ow - 0.7, 1.0, [
    br({ text: "java -javaagent:elastic-apm-agent.jar \\", options: { color: C.ice } }),
    br({ text: "     -jar quarkus-app.jar", options: { color: C.ice } }),
  ], { fontSize: 11.5 });
  s.addText("Requests, DB calls, and the LLM call all show up as spans in Kibana.", {
    x: M + 0.35, y: 5.55, w: ow - 0.7, h: 0.7, fontFace: FONT_B, fontSize: 12.5, italic: true, color: C.muted,
    align: "left", valign: "top", margin: 0 });

  const vx = M + ow + 0.5, vw = W - M - vx;
  card(s, vx, 2.55, vw, 3.8, C.card);
  iconChip(s, vx + 0.3, 2.85, 0.85, I.chart, C.cardHi);
  s.addText("Native image  ·  the fallback", { x: vx + 1.3, y: 2.95, w: vw - 1.5, h: 0.6, fontFace: FONT_H,
    fontSize: 17, bold: true, color: C.amber, align: "left", valign: "middle", margin: 0 });
  s.addText([
    { text: "The Java agent needs a JVM, so for native you switch to the built-in ", options: { color: C.ice } },
    { text: "OpenTelemetry extension", options: { color: C.amber, bold: true } },
    { text: " and export over OTLP.", options: { color: C.ice, breakLine: true } },
    { text: "\n", options: { breakLine: true } },
    { text: "Vendor-neutral: traces, metrics, logs → Elastic (or Jaeger, Datadog…). Same Kibana dashboards. Slightly less auto-instrumentation, no lock-in.", options: { color: C.muted } },
  ], { x: vx + 0.35, y: 3.85, w: vw - 0.7, h: 2.4, fontFace: FONT_B, fontSize: 13.5, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.12 });
  s.addNotes(
    "This is the slide that wins over the people who sign off on production. Lead with the JVM-mode message because that's what they'll actually deploy: the APM agent attaches unchanged, full stop. " +
    "Show the -javaagent line so it's concrete and unscary — it's the same incantation they already use. " +
    "Only mention OpenTelemetry as the native-image path, and frame it as a feature (vendor-neutral, no lock-in) rather than a downgrade. " +
    "If you have a Kibana screenshot of an LLM call as a span, this is where you flash it — seeing the model latency in their existing dashboard is the moment it clicks."
  );
  footer(s, 15);

  // =========================================================
  // SLIDE 16 — DEV TODAY, PROD TOMORROW
  // =========================================================
  s = pres.addSlide(); base(s);
  header(s, { tag: "// to production", title: "From demo to production is a config diff, not a rewrite", accent: C.coral, num: 16 });

  const tbl = [
    [
      { text: "Concern", options: { bold: true, color: C.white, fill: { color: C.cardHi }, fontFace: FONT_H, fontSize: 14, valign: "middle" } },
      { text: "Demo today", options: { bold: true, color: C.white, fill: { color: C.cardHi }, fontFace: FONT_H, fontSize: 14, valign: "middle" } },
      { text: "Production swap-in", options: { bold: true, color: C.white, fill: { color: C.cardHi }, fontFace: FONT_H, fontSize: 14, valign: "middle" } },
    ],
    ["Vector store", "In-memory", "PostgreSQL + pgvector (or Milvus, Pinecone…)"],
    ["LLM provider", "OpenAI gpt-4o-mini", "Azure OpenAI · or self-hosted Ollama, fully on-prem"],
    ["Deployment", "mvn quarkus:dev", "JAR + Elastic APM agent — on the servers you already run"],
    ["Documents", "6 newsletter PDFs", "Your real corpus, re-ingested on a schedule"],
    ["Cost shape", "Pennies", "Scales ~linearly with tokens; infra stays flat"],
  ];
  s.addTable(tbl, {
    x: M, y: 2.55, w: W - 2 * M, colW: [2.7, 3.3, W - 2 * M - 6.0],
    rowH: [0.5, 0.62, 0.62, 0.62, 0.62, 0.62],
    border: { type: "solid", pt: 1, color: C.line },
    fill: { color: C.card }, color: C.ice, fontFace: FONT_B, fontSize: 13, valign: "middle",
    align: "left", margin: [4, 8, 4, 8],
  });
  s.addText([
    { text: "The point:  ", options: { color: C.coral, bold: true } },
    { text: "every right-hand cell is a dependency or a property — not an architectural change. Your DevOps team keeps their runbook.", options: { color: C.ice } },
  ], { x: M, y: 6.55, w: W - 2 * M, h: 0.5, fontFace: FONT_B, fontSize: 13.5, align: "left", valign: "middle", margin: 0 });
  s.addNotes(
    "De-risk the obvious objection: 'sure, it demos, but productionizing AI is a project.' Here it isn't — each row is a swap, not a redesign. " +
    "Hit the two that matter most to this audience: pgvector means the vector store is just Postgres (a database they already run and back up), and Ollama means the whole thing can run on-prem with no data leaving the building — the answer to every security and compliance question. " +
    "Cost shape: the LLM API is the variable cost and it scales with usage; the infrastructure footprint stays flat. Close on 'your DevOps team keeps their runbook' — that's the sentence that gets this into production."
  );
  footer(s, 16);

  // =========================================================
  // SLIDE 17 — CLOSING
  // =========================================================
  s = pres.addSlide(); base(s);
  s.addText("//", { x: 10.5, y: -1.0, w: 3.5, h: 5, align: "right", fontFace: FONT_H, fontSize: 220, bold: true,
    color: C.panel, margin: 0 });
  s.addImage({ data: I.quote, x: M, y: 1.5, w: 0.7, h: 0.7 });
  s.addText("If you can write a REST endpoint,\nyou can build an AI feature.", {
    x: M, y: 2.4, w: 11.0, h: 1.7, fontFace: FONT_H, fontSize: 40, bold: true, color: C.white, align: "left",
    valign: "top", margin: 0, lineSpacingMultiple: 1.05 });
  s.addText("You've been overthinking it. The hard part was never the model — it was wiring it to your data safely, and that's the part Java has always been good at.", {
    x: M, y: 4.25, w: 10.5, h: 1.0, fontFace: FONT_B, fontSize: 17, italic: true, color: C.muted, align: "left",
    valign: "top", margin: 0 });

  // takeaways chips
  const chips = ["Ground it with RAG", "Stay in Java", "Keep your APM", "Ship the JAR"];
  let chx = M;
  chips.forEach((c) => {
    const cwch = 0.45 + c.length * 0.115;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: chx, y: 5.45, w: cwch, h: 0.55, rectRadius: 0.27,
      fill: { color: C.card }, line: { color: C.emerald, width: 1 } });
    s.addText(c, { x: chx, y: 5.45, w: cwch, h: 0.55, align: "center", valign: "middle", fontFace: FONT_B,
      fontSize: 13, color: C.emerald, bold: true, margin: 0 });
    chx += cwch + 0.25;
  });

  s.addShape(pres.shapes.LINE, { x: M, y: 6.35, w: W - 2 * M, h: 0, line: { color: C.line, width: 1 } });
  s.addText([
    { text: "Thanks — questions welcome.    ", options: { color: C.white, bold: true } },
    { text: "github.com/langchain4j  ·  quarkus.io/guides  ·  docs.quarkiverse.io/quarkus-langchain4j", options: { color: C.muted, fontFace: FONT_M, fontSize: 12 } },
  ], { x: M, y: 6.55, w: W - 2 * M, h: 0.5, fontFace: FONT_B, fontSize: 15, align: "left", valign: "middle", margin: 0 });
  s.addNotes(
    "Land the closing line cleanly and then stop talking — let it sit. 'If you can write a REST endpoint, you can build an AI feature. You've been overthinking it.' " +
    "The four chips are the entire talk compressed: ground it with RAG, stay in Java, keep your APM, ship the JAR. If someone only remembers four words, these are the four. " +
    "Then open Q&A. Anticipated questions: data security (answer: Ollama on-prem, nothing leaves the building), cost (scales with tokens, infra flat), 'why not Python' (your data and your ops are already here), and 'is JVM mode really fine for prod' (yes — native is an option, not a requirement). " +
    "Leave the resource links on screen during Q&A."
  );
  footer(s, 17);

  // =========================================================
  await pres.writeFile({ fileName: "C:/WEBINAR/bitesized-session-langchain4j-quarkus/presentation/RAG-Four-Ways.pptx" });
  console.log("deck written");
}

build().catch((e) => { console.error(e); process.exit(1); });
