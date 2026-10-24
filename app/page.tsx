"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";

/* Real URLs only. Leave a value as "" and that link simply won't render. */
const LINKS = {
  santraRepo: "https://github.com/K-kaustubh420/santra-api",
  recoverRepo: "https://github.com/K-kaustubh420/razorpay-recover-ai",
  energyRepo: "https://github.com/K-kaustubh420/energy-anomally-detection",
  easymaps: "https://easymaps.vercel.app/", // paste the live EasyMaps URL
  linkedout: "https://linkedout-delta.vercel.app/", // paste the live LinkedOut URL
  resume: "https://drive.google.com/file/d/1DSe4-BxmSHM6IjRWvmfc3PL0cB8NLaQF/view?usp=sharing", // put your PDF at public/resume.pdf
  github: "https://github.com/K-kaustubh420",
  email: "kkaustubh92@gmail.com",
};

/* Fill this in from the energy project's GET /model-evaluation output.
   While it is null, no metrics are shown, so nothing is made up. */
const ENERGY_RESULTS: null | {
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
} = null;

type Node = { title: string; note?: string; accent?: boolean; dashed?: boolean };

const INDEX = [
  { href: "#santra", name: "Santra", note: "OpenAI-compatible API" },
  { href: "#recover", name: "Recover AI", note: "Payment recovery engine" },
  { href: "#energy", name: "Energy Anomaly", note: "Applied ML" },
  { href: "#easymaps", name: "EasyMaps", note: "Mapping UI kit" },
  { href: "#linkedout", name: "LinkedOut", note: "Social platform" },
  { href: "#novus", name: "Novus Tales", note: "AI social app, work" },
];

const PLATES = ["Energy Anomaly", "Recover AI", "Novus Tales", "LinkedOut", "EasyMaps", "Santra"];

/* ---------- small pieces ---------- */

function Ext({ href, children }: { href: string; children: ReactNode }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-u lime small">
      {children}
      <span className="sr"> (opens in a new tab)</span>
    </a>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

function Head({
  name,
  line,
  meta,
  big,
  children,
}: {
  name: string;
  line: string;
  meta: string;
  big?: boolean;
  children?: ReactNode;
}) {
  return (
    <header className="head">
      <div>
        <h2 className={big ? "h-big" : "h-mid"}>{name}</h2>
        <p className="muted lead">{line}</p>
      </div>
      <div className="head-side">
        <p className="mono muted xs">{meta}</p>
        <div className="row-links">{children}</div>
      </div>
    </header>
  );
}

/* Card that leans toward the pointer. Resting angle gives depth on touch too. */
function Tilt({ children, max = 8 }: { children: ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--rx", `${-py * max}deg`);
    ref.current.style.setProperty("--ry", `${px * max * 1.6}deg`);
  };
  const leave = () => {
    ref.current?.style.removeProperty("--rx");
    ref.current?.style.removeProperty("--ry");
  };
  return (
    <div className="tilt-wrap" onPointerMove={move} onPointerLeave={leave}>
      <div className="tilt" ref={ref}>
        {children}
      </div>
    </div>
  );
}

/* Rows of boxes at increasing depth: a layered diagram. */
function Layers({ rows, caption }: { rows: Node[][]; caption: string }) {
  return (
    <figure className="fig">
      <Tilt>
        <div className="layers">
          {rows.map((row, i) => (
            <div key={i} className="lrow" style={{ "--z": i * 34 } as CSSProperties}>
              {row.map((n) => (
                <div
                  key={n.title}
                  className={`node ${n.accent ? "accent" : ""} ${n.dashed ? "dashed" : ""}`}
                >
                  <p className="node-t">{n.title}</p>
                  {n.note && <p className="muted xs">{n.note}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Tilt>
      <figcaption className="mono muted xs">{caption}</figcaption>
    </figure>
  );
}

/* Map-like plane with a floating overlay layer. Schematic only. */
function MapPlane() {
  return (
    <figure className="fig">
      <Tilt max={6}>
        <div className="mapstage">
          <div className="mapplane">
            <svg viewBox="0 0 400 300" aria-hidden="true">
              <path d="M0 210 C80 190 160 240 260 215 S360 200 400 210" className="road" />
              <path d="M90 0 C100 90 70 190 95 300" className="road" />
              <path d="M270 0 C260 100 300 200 280 300" className="road" />
              <path d="M0 90 H400" className="road thin" />
              <path d="M0 150 C120 130 220 170 400 140" className="road thin" />
            </svg>
          </div>
          <div className="mapover">
            <svg viewBox="0 0 400 300" aria-hidden="true">
              <path
                d="M60 70 L180 100 L260 60 L320 150 L230 230"
                className="route"
              />
              <circle cx="60" cy="70" r="11" className="ring" />
              <circle cx="230" cy="230" r="11" className="ring" />
              <circle cx="128" cy="168" r="18" className="pin" />
              <text x="128" y="173" textAnchor="middle" className="pin-t">4</text>
              <circle cx="330" cy="90" r="15" className="pin" />
              <text x="330" y="95" textAnchor="middle" className="pin-t">3</text>
              {[
                [180, 100],
                [260, 60],
                [320, 150],
                [150, 240],
                [50, 190],
              ].map(([x, y]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r="5.5" className="pin" />
              ))}
            </svg>
          </div>
          <ul className="floaters">
            <li style={{ "--z": 70, top: "8%", left: "6%" } as CSSProperties}>Clustering</li>
            <li style={{ "--z": 90, top: "40%", right: "4%" } as CSSProperties}>Routing</li>
            <li style={{ "--z": 60, bottom: "8%", left: "10%" } as CSSProperties}>Themes</li>
          </ul>
        </div>
      </Tilt>
      <figcaption className="mono muted xs">
        Schematic of the kit’s features. Not a screenshot.
      </figcaption>
    </figure>
  );
}


/* ---------- ML case-study pieces ---------- */

function Chart({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="chart">
      <p className="chart-t">{title}</p>
      {children}
      <figcaption className="mono muted xs">{caption}</figcaption>
    </figure>
  );
}

/* Numbers below are the benchmark figures stated in the Recover AI README. */
function RecoveryBars() {
  const risk = 68240;
  const rec = 22179;
  return (
    <Chart
      title="Simulated benchmark: revenue at risk and recovered"
      caption="Simulated. 60 failed subscription payments from the project’s benchmark file, with outcomes decided by its probabilistic simulator. These are not real payments or real recoveries."
    >
      <div className="bars">
        <div className="bar-row">
          <span className="small">At risk</span>
          <div className="bar"><i style={{ width: "100%" }} /></div>
          <span className="mono xs">₹68,240</span>
        </div>
        <div className="bar-row">
          <span className="small">Recovered</span>
          <div className="bar">
            <i className="on" style={{ width: `${((rec / risk) * 100).toFixed(1)}%` }} />
          </div>
          <span className="mono xs">₹22,179</span>
        </div>
      </div>
      <dl className="stats">
        <div><dt>Gross recovery rate</dt><dd>32.5%</dd></div>
        <div><dt>Fraud cases auto-retried</dt><dd>0</dd></div>
        <div><dt>Retries blocked by stopping rules</dt><dd>6</dd></div>
        <div><dt>Escalated to human review</dt><dd>9</dd></div>
      </dl>
    </Chart>
  );
}

function Pipeline({ steps, caption }: { steps: { t: string; d: string }[]; caption: string }) {
  return (
    <figure className="fig">
      <ol className="pipe">
        {steps.map((s) => (
          <li key={s.t}>
            <p className="node-t">{s.t}</p>
            <p className="muted small">{s.d}</p>
          </li>
        ))}
      </ol>
      <figcaption className="mono muted xs">{caption}</figcaption>
    </figure>
  );
}

/* Generated values that show the idea only. Not the project's dataset. */
function EnergySeries() {
  const pts = Array.from({ length: 60 }, (_, i) => {
    let v = 200 + 26 * Math.sin(i * 0.55) + (((i * 37) % 11) - 5) * 4;
    if (i === 14 || i === 15) v = 585 + (i - 14) * 25;
    if (i === 38) v = 560;
    if (i === 47 || i === 48) v = 35 + (i - 47) * 10;
    return v;
  });
  const x = (i: number) => 44 + i * (580 / 59);
  const y = (v: number) => 200 - v * 0.26;
  const flagged = (v: number) => v > 450 || v < 90;
  const d = pts.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <Chart
      title="What flagged readings look like"
      caption="Illustration with generated values. It is not output from the project’s dataset."
    >
      <svg viewBox="0 0 640 220" role="img" aria-label="Line chart of generated power readings with a few spikes and dips ringed as anomalies" className="svg-chart">
        {[0, 350, 700].map((w) => (
          <g key={w}>
            <line x1="40" x2="630" y1={y(w)} y2={y(w)} className="grid-l" />
            <text x="34" y={y(w) + 4} textAnchor="end" className="ax">{w} W</text>
          </g>
        ))}
        <path d={d} className="series" />
        {pts.map((v, i) =>
          flagged(v) ? (
            <g key={i}>
              <circle cx={x(i)} cy={y(v)} r="8" className="flag-ring" />
              <circle cx={x(i)} cy={y(v)} r="3" className="flag-dot" />
            </g>
          ) : null
        )}
      </svg>
    </Chart>
  );
}

/* Usage ranges come from the demo app's mock /api/stream route, not real meters. */
function StreamRanges() {
  const rows: { name: string; bands: [number, number][] }[] = [
    { name: "normal_household", bands: [[180, 250]] },
    { name: "industrial_overuse", bands: [[550, 700]] },
    { name: "erratic_load", bands: [[200, 250], [610, 630]] },
    { name: "critical_fault", bands: [[600, 650]] },
  ];
  const x = (w: number) => 170 + w * (450 / 700);
  return (
    <Chart
      title="The four demo streams, in watts"
      caption="Ranges the demo app’s mock stream route generates. Smart-meter hardware isn’t connected."
    >
      <svg viewBox="0 0 640 190" role="img" aria-label="Range chart of the four demo energy streams" className="svg-chart">
        {[0, 350, 700].map((w) => (
          <g key={w}>
            <line x1={x(w)} x2={x(w)} y1="10" y2="150" className="grid-l" />
            <text x={x(w)} y="172" textAnchor="middle" className="ax">{w} W</text>
          </g>
        ))}
        {rows.map((r, i) => (
          <g key={r.name}>
            <text x="160" y={38 + i * 34} textAnchor="end" className="ax">{r.name}</text>
            {r.bands.map(([a, b]) => (
              <rect key={a} x={x(a)} y={26 + i * 34} width={x(b) - x(a)} height="14" className="band" />
            ))}
          </g>
        ))}
      </svg>
    </Chart>
  );
}

/* Thresholds are the ones in the backend's /analyze-window logic. */
function DiagnosticBands() {
  return (
    <Chart
      title="How a 30 to 60 second window is diagnosed"
      caption="Share of readings in the window that the model flags as anomalous."
    >
      <div className="bands" role="img" aria-label="Under 10 percent is System Healthy, 10 to 50 percent is Unstable Load Pattern, over 50 percent is Critical Sustained Anomaly">
        <div style={{ flex: 10 }}><span>Healthy</span></div>
        <div style={{ flex: 40 }} className="mid"><span>Unstable load pattern</span></div>
        <div style={{ flex: 50 }} className="hot"><span>Critical sustained anomaly</span></div>
      </div>
      <div className="band-ticks mono xs muted"><span>0%</span><span>10%</span><span>50%</span><span>100%</span></div>
    </Chart>
  );
}

/* ---------- page ---------- */

export default function Page() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const on = (e: globalThis.PointerEvent) => {
      el.style.setProperty("--mx", String(e.clientX / window.innerWidth - 0.5));
      el.style.setProperty("--my", String(e.clientY / window.innerHeight - 0.5));
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);

  return (
    <div className="kk" id="top">
      <title>Kaustubh Kushwaha: things I’ve been building</title>
      <meta
        name="description"
        content="Portfolio of Kaustubh Kushwaha: an OpenAI-compatible API for local models, a payment recovery engine, energy anomaly detection, a mapping UI kit, a social platform and AI work at Novus Tales."
      />
      <style>{CSS}</style>

      <a href="#work" className="skip">Skip to work</a>

      <header className="nav">
        <nav aria-label="Main" className="wrap nav-in">
          <a href="#top" className="brand">Kaustubh Kushwaha</a>
          <ul>
            <li><a href="#work" className="link-u">Work</a></li>
            <li><a href="#about" className="link-u">About</a></li>
            <li>
              <a href={LINKS.resume} target="_blank" rel="noopener noreferrer" className="resume">
                Resume
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Opening */}
        <section className="hero">
          <div className="gridbg" aria-hidden="true" />
          <div className="wrap hero-in">
            <div>
              <h1 className="rise">Things I’ve been building.</h1>
              <p className="muted lead hero-sub">
                Software, AI integrations and tools. Mostly APIs and web apps,
                plus some experiments with models that run locally.
              </p>
              <nav aria-label="Projects" className="index">
                <ul>
                  {INDEX.map((p) => (
                    <li key={p.href}>
                      <a href={p.href}>
                        <span className="ix-name">
                          <i />
                          {p.name}
                        </span>
                        <span className="muted small">{p.note}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="scene-wrap" aria-hidden="true">
              <div className="scene" ref={sceneRef}>
                {PLATES.map((p, i) => (
                  <div
                    key={p}
                    className={`plate ${i === PLATES.length - 1 ? "top" : ""}`}
                    style={{ "--i": i } as CSSProperties}
                  >
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="work" aria-label="Selected work">
          {/* Santra */}
          <article id="santra" className="proj">
            <div className="wrap">
              <Head
                big
                name="Santra"
                line="An API that gives AI models, including local ones, an OpenAI-compatible interface."
                meta="Completed project"
              >
                <Ext href={LINKS.santraRepo}>Repository on GitHub</Ext>
              </Head>
              <div className="split">
                <div className="prose">
                  <p>
                    Santra is an API that provides an OpenAI-compatible interface
                    for working with AI models, including local models. It covers
                    chat completions, streaming responses and file handling.
                  </p>
                  <p className="muted">
                    The point of staying compatible is practical: code that
                    already speaks the OpenAI request format can be pointed at a
                    different model by changing the base URL, without being
                    rewritten.
                  </p>
                  <dl className="facts">
                    <div>
                      <dt>Local model</dt>
                      <dd>I integrated a locally cached Qwen model with DeepSeek Harness.</dd>
                    </div>
                    <div>
                      <dt>Compatibility</dt>
                      <dd>I tested the API against the OpenAI interface to check that clients behave the same way.</dd>
                    </div>
                    <div>
                      <dt>Streaming</dt>
                      <dd>Replies can stream back chunk by chunk.</dd>
                    </div>
                  </dl>
                </div>
                <Layers
                  caption="How the pieces fit together, simplified."
                  rows={[
                    [{ title: "Client", note: "Any OpenAI-style SDK or curl" }],
                    [{ title: "Santra API", note: "Chat completions, streaming, file handling", accent: true }],
                    [
                      { title: "Local Qwen model", note: "Locally cached, via DeepSeek Harness" },
                      { title: "Other models", note: "Other backends it can integrate", dashed: true },
                    ],
                  ]}
                />
              </div>
            </div>
          </article>

          {/* Recover AI */}
          <article id="recover" className="proj">
            <div className="wrap">
              <Head
                big
                name="Recover AI"
                line="A recovery engine for failed subscription payments, built for the Razorpay AI Buildathon."
                meta="Hackathon project, Track 03: Revenue Recovery"
              >
                <Ext href={LINKS.recoverRepo}>Repository on GitHub</Ext>
              </Head>

              <div className="split flip">
                <div className="prose">
                  <p>
                    When a subscription payment fails, the right next step depends
                    on why it failed. An expired card needs a new payment link, a
                    temporary bank decline is worth a retry, and a fraud flag
                    should never be retried. Recover AI reads the failure details
                    and picks the action, within limits on what it may do.
                  </p>
                  <p className="muted">
                    Mistral AI diagnoses each failure and returns a structured
                    result: the cause, its reasoning and a recommended action. That
                    diagnosis comes from a prompted LLM, not a classifier I
                    trained, and rule-based heuristics take over when there’s no
                    API key.
                  </p>
                  <div>
                    <p className="muted small tag-label">Built with</p>
                    <Tags items={["Python", "FastAPI", "Mistral AI", "Next.js", "Server-Sent Events"]} />
                  </div>
                </div>
                <RecoveryBars />
              </div>

              <div className="split sub">
                <Pipeline
                  caption="Simplified from the project’s architecture diagram."
                  steps={[
                    { t: "A failed payment arrives", d: "From a batch CSV, a live event stream, or the ingest webhook, which ignores duplicate deliveries." },
                    { t: "Playbook and guards", d: "Deterministic dunning policies decide what is allowed for this kind of failure." },
                    { t: "Diagnosis", d: "Mistral AI returns the cause, reasoning and recommended action. Rule heuristics are the fallback." },
                    { t: "Stopping rules", d: "Fraud flags, a daily contact cap, retry cooldowns and retry exhaustion can override the recommendation." },
                    { t: "Operating mode", d: "AUTO acts on its own, HUMAN asks a supervisor first, LAZY queues escalations for review later." },
                    { t: "Outcome and audit log", d: "A probabilistic simulator decides whether recovery worked. Every decision is appended to the audit CSVs." },
                  ]}
                />
                <dl className="facts">
                  <div>
                    <dt>Guardrails sit after the model</dt>
                    <dd>Fraud-flagged cases go straight to human review without an LLM call or a retry. Customers are contacted at most once a day.</dd>
                  </div>
                  <div>
                    <dt>Review workspace</dt>
                    <dd>A Next.js interface with swipeable approve and reject cards, live metrics and an audit log.</dd>
                  </div>
                  <div>
                    <dt>Simulated, not real</dt>
                    <dd>Recovery outcomes in the benchmark come from a simulator. The project hasn’t processed real payments.</dd>
                  </div>
                  <div>
                    <dt>Tests</dt>
                    <dd>Unit tests for the backend logic and integration tests for the API.</dd>
                  </div>
                </dl>
              </div>
            </div>
          </article>

          {/* Energy anomaly detection */}
          <article id="energy" className="proj">
            <div className="wrap">
              <Head
                big
                name="Energy Anomaly Detection"
                line="Flags unusual energy readings that point to spikes, faults or wasted power."
                meta="Applied ML project"
              >
                <Ext href={LINKS.energyRepo}>Repository on GitHub</Ext>
              </Head>

              <div className="gap-lg">
                <EnergySeries />
              </div>

              <div className="split sub">
                <div className="prose">
                  <p>
                    The backend is a FastAPI service around a scikit-learn
                    Isolation Forest. It’s trained on the Appliances column of
                    KAG_energydata_complete.csv: readings are scaled, then scored
                    by 50 isolation trees, and a negative decision score means
                    anomaly.
                  </p>
                  <p className="muted">
                    A single reading goes to one endpoint. For sustained problems,
                    another endpoint takes 30 to 60 seconds of readings and turns
                    the share of anomalous points into a plain-language diagnosis.
                  </p>
                  <p className="muted">
                    A Next.js dashboard built with Recharts shows the live
                    readings, the model’s evaluation and a comparison against
                    India’s BEE efficiency standards.
                  </p>
                  <Tags items={["Python", "FastAPI", "scikit-learn", "Isolation Forest", "Next.js", "Recharts"]} />
                </div>
                <div className="col">
                  <DiagnosticBands />
                  <StreamRanges />
                </div>
              </div>

              <div className="split sub">
                <Pipeline
                  caption="Training and evaluation, as documented in the repository."
                  steps={[
                    { t: "Load the data", d: "Read the Appliances column and drop rows with missing values." },
                    { t: "Sample and scale", d: "Take up to 10,000 rows and apply StandardScaler." },
                    { t: "Fit the model", d: "Isolation Forest with 50 trees, contamination 0.05 and a fixed random seed. The model and scaler are saved as pickles." },
                    { t: "Score readings", d: "A decision score below zero is flagged as an anomaly." },
                    { t: "Evaluate", d: "Precision, recall, F1, ROC-AUC and a confusion matrix, computed against pseudo-labels." },
                  ]}
                />
                <div className="prose">
                  <dl className="facts">
                    <div>
                      <dt>How evaluation works</dt>
                      <dd>The dataset has no anomaly labels. A reading counts as anomalous when its robust z-score, based on the median and MAD, is above 3.5. The metrics therefore measure agreement with that statistical rule, not with confirmed faults.</dd>
                    </div>
                    <div>
                      <dt>Demo data</dt>
                      <dd>The live streams in the app are generated by a mock route. No smart meter is connected yet.</dd>
                    </div>
                  </dl>
                  {ENERGY_RESULTS && (
                    <dl className="stats">
                      <div><dt>Precision</dt><dd>{ENERGY_RESULTS.precision}</dd></div>
                      <div><dt>Recall</dt><dd>{ENERGY_RESULTS.recall}</dd></div>
                      <div><dt>F1</dt><dd>{ENERGY_RESULTS.f1}</dd></div>
                      <div><dt>ROC-AUC</dt><dd>{ENERGY_RESULTS.rocAuc}</dd></div>
                    </dl>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* EasyMaps */}
          <article id="easymaps" className="proj">
            <div className="wrap">
              <Head
                big
                name="EasyMaps"
                line="A copy-paste mapping UI kit for web apps."
                meta="Independent project"
              >
                <Ext href={LINKS.easymaps}>Live site</Ext>
              </Head>
              <div className="split flip">
                <div className="prose">
                  <p>
                    EasyMaps lets you add a working map to a web app by copying
                    components in, with minimal setup. It includes clustering,
                    advanced routing and customizable themes.
                  </p>
                  <p className="muted">
                    Adding a map usually means solving the same problems again:
                    crowded markers, getting a route on screen, and making the
                    map match the rest of the interface. The kit packages those
                    pieces so they can be reused.
                  </p>
                  <div>
                    <p className="muted small tag-label">Built with</p>
                    <Tags items={["Next.js", "Leaflet.js", "OpenStreetMap", "Tailwind CSS", "Deployed on Vercel"]} />
                  </div>
                </div>
                <MapPlane />
              </div>
            </div>
          </article>

          {/* LinkedOut + Novus */}
          <div className="two">
            <article id="linkedout" className="proj half">
              <div className="inner">
                <Head
                  name="LinkedOut"
                  line="A social platform built with Next.js and Firebase."
                  meta="Independent project"
                >
                  <Ext href={LINKS.linkedout}>Live site</Ext>
                </Head>
                <div className="gap">
                  <Layers
                    caption="Stack diagram, not a screenshot."
                    rows={[
                      [{ title: "Next.js app", note: "The platform’s front end", accent: true }],
                      [{ title: "Firebase", note: "Backend services" }],
                    ]}
                  />
                </div>
                <Tags items={["Next.js", "Firebase"]} />
              </div>
            </article>

            <article id="novus" className="proj half">
              <div className="inner">
                <Head
                  name="Novus Tales"
                  line="AI-powered social app, built as a lead developer."
                  meta="Novus Tales LLC, January to July 2025"
                />
                <p className="gap">
                  This was company work, not a solo project. I was a full-stack
                  and lead developer on a social app built with Next.js and
                  Firebase on a serverless backend, and I integrated Mistral AI
                  to produce personalized recommendations.
                </p>
                <Layers
                  caption="Simplified architecture diagram, not a screenshot."
                  rows={[
                    [{ title: "Next.js app" }],
                    [{ title: "Serverless backend", accent: true }],
                    [
                      { title: "Firestore", note: "Social graph" },
                      { title: "Mistral AI", note: "Recommendations" },
                    ],
                  ]}
                />
                <p className="muted xs ruled">Figures from my resume</p>
                <ul className="figs">
                  <li>More than 2,000 daily users.</li>
                  <li>A 20% engagement improvement reported with the personalized recommendations.</li>
                  <li>A Firestore schema handling more than 10,000 daily social graph updates.</li>
                </ul>
              </div>
            </article>
          </div>

          {/* Other work */}
          <section aria-label="Other work" className="other">
            <div className="wrap other-in">
              <h2 className="h-sm">Other work</h2>
              <ul className="olist">
                <li>
                  <p className="strong">Creed Care web app and microservices</p>
                  <p className="muted small">
                    Web app and supporting microservices for business operations
                    at Agility Hospitality Services Pvt. Ltd. (Creed Care),
                    remote, September 2025 to February 2026.
                  </p>
                </li>
                <li>
                  <p className="strong">Department web app</p>
                  <p className="muted small">A Next.js web app for the Ctech department at SRMIST.</p>
                </li>
              </ul>
            </div>
          </section>
        </section>

        {/* About */}
        <section id="about" className="about">
          <div className="wrap other-in">
            <h2 className="h-sm">About</h2>
            <div className="prose">
              <p className="about-lead">
                I’m Kaustubh Kushwaha. I’m studying B.Tech Computer Science and
                Engineering at SRM Institute of Science and Technology, and I
                graduate in 2027.
              </p>
              <p className="muted">
                I like building useful tools: web applications, APIs and AI
                integrations, including running models locally.
              </p>
              <p>
                <a href={`mailto:${LINKS.email}`} className="link-u lime">{LINKS.email}</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-in muted small">
          <p>Kaustubh Kushwaha, 2026</p>
          <ul>
            <li><a href={LINKS.resume} target="_blank" rel="noopener noreferrer" className="link-u">Resume (PDF)</a></li>
            <li><a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="link-u">GitHub</a></li>
            <li><a href={`mailto:${LINKS.email}`} className="link-u">Email</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

/* ---------- styles (kept in this file so it stays one file) ---------- */

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600&family=JetBrains+Mono:wght@400&display=swap");
html{background:#121314;scroll-behavior:smooth;scroll-padding-top:64px}
body{margin:0}
.kk{--bg:#121314;--panel:#181a1b;--line:#2e3132;--fg:#ece8e1;--muted:#9d9a92;--lime:#b8f23a;
  background:var(--bg);color:var(--fg);min-height:100vh;
  font-family:"Bricolage Grotesque",system-ui,-apple-system,"Segoe UI",sans-serif;
  font-size:17px;line-height:1.55;-webkit-font-smoothing:antialiased}
.kk *,.kk *::before,.kk *::after{box-sizing:border-box}
.kk a{color:inherit;text-decoration:none}
.kk ul{list-style:none;margin:0;padding:0}
.kk p,.kk h1,.kk h2,.kk dl,.kk dd,.kk figure{margin:0}
.kk ::selection{background:var(--lime);color:#121314}
.kk :focus-visible{outline:2px solid var(--lime);outline-offset:3px}
.muted{color:var(--muted)} .lime{color:var(--lime)} .strong{font-weight:500}
.small{font-size:14px} .xs{font-size:12.5px} .lead{font-size:18px}
.mono{font-family:"JetBrains Mono",ui-monospace,monospace}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip{position:absolute;left:-999px;top:8px;z-index:60;background:var(--lime);color:#121314;padding:8px 12px}
.skip:focus{left:8px}
.wrap{width:100%;max-width:1280px;margin:0 auto;padding:0 clamp(20px,4vw,40px)}
.link-u{background:linear-gradient(var(--lime),var(--lime)) 0 100%/0 1px no-repeat;transition:background-size .25s}
.link-u:hover,.link-u:focus-visible{background-size:100% 1px}

.nav{position:sticky;top:0;z-index:50;background:var(--bg);border-bottom:1px solid var(--line)}
.nav-in{display:flex;height:56px;align-items:center;justify-content:space-between}
.nav ul{display:flex;align-items:center;gap:24px;font-size:14px}
.brand{font-weight:500;letter-spacing:-.01em}
.resume{color:var(--muted);border:1px solid var(--line);border-radius:2px;padding:4px 10px;font-size:12.5px;transition:.2s}
.resume:hover{color:var(--lime);border-color:var(--lime)}

.hero{position:relative;overflow:hidden;border-bottom:1px solid var(--line)}
.gridbg{position:absolute;inset:0;opacity:.28;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:64px 64px;-webkit-mask-image:linear-gradient(#000,transparent 85%);mask-image:linear-gradient(#000,transparent 85%)}
.hero-in{position:relative;display:grid;gap:40px;padding-top:72px;padding-bottom:64px;align-items:center}
@media(min-width:960px){.hero-in{grid-template-columns:1.25fr 1fr;padding-top:96px;padding-bottom:96px}}
h1{font-size:clamp(3.2rem,8.5vw,7.5rem);font-weight:600;line-height:.92;letter-spacing:-.04em}
.rise{animation:rise .9s cubic-bezier(.2,.7,.2,1) both}
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.hero-sub{max-width:30em;margin-top:28px}
.index{margin-top:40px;max-width:520px}
.index ul{border-top:1px solid var(--line)}
.index a{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:14px 0;border-bottom:1px solid var(--line)}
.ix-name{display:flex;align-items:center;gap:12px;font-size:20px;font-weight:500;transition:color .2s}
.ix-name i{display:block;height:1px;width:0;background:var(--lime);transition:width .25s}
.index a:hover .ix-name,.index a:focus-visible .ix-name{color:var(--lime)}
.index a:hover i,.index a:focus-visible i{width:24px}

.scene-wrap{perspective:1400px;height:440px;display:grid;place-items:center}
.scene{position:relative;width:260px;height:260px;transform-style:preserve-3d;
  transform:rotateX(calc(58deg + var(--my,0)*-10deg)) rotateZ(calc(-38deg + var(--mx,0)*14deg));
  transition:transform .25s ease-out}
.plate{position:absolute;inset:0;border:1px solid var(--line);background:rgba(24,26,27,.94);
  background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:26px 26px;
  transform:translateZ(calc(var(--i)*56px - 140px));display:flex;align-items:flex-end;padding:14px;
  font:13px "JetBrains Mono",ui-monospace,monospace;color:var(--muted);
  animation:assemble 1.3s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--i)*90ms)}
.plate.top{border-color:var(--lime);color:var(--lime)}
.plate::before{content:"";position:absolute;top:-1px;left:-1px;width:18px;height:18px;border-top:2px solid var(--lime);border-left:2px solid var(--lime)}
@keyframes assemble{from{transform:translateZ(0)}}
@media(max-width:700px){.scene-wrap{height:340px}.scene{scale:.72}}

.proj{border-bottom:1px solid var(--line);padding:96px 0}
.head{display:flex;flex-direction:column;gap:24px}
@media(min-width:800px){.head{flex-direction:row;align-items:flex-end;justify-content:space-between}}
.h-big{font-size:clamp(2.75rem,7vw,5.5rem);font-weight:600;line-height:1;letter-spacing:-.03em}
.h-mid{font-size:clamp(2.25rem,4vw,3.5rem);font-weight:600;line-height:1;letter-spacing:-.03em}
.h-sm{font-size:24px;font-weight:600;letter-spacing:-.01em}
.head .lead{max-width:34em;margin-top:16px}
.head-side{display:flex;flex-direction:column;gap:12px}
@media(min-width:800px){.head-side{align-items:flex-end}}
.row-links{display:flex;gap:20px}
.split{display:grid;gap:56px;margin-top:56px;align-items:center}
@media(min-width:960px){.split{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr)}.split.flip{grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr)}.split.flip>:first-child{order:2}}
.prose{max-width:36em;display:flex;flex-direction:column;gap:22px}
.facts{display:flex;flex-direction:column;gap:18px;border-top:1px solid var(--line);padding-top:22px;font-size:14.5px}
.facts dt{font-weight:500}.facts dd{color:var(--muted);margin-top:4px}
.tags{display:flex;flex-wrap:wrap;gap:8px}
.tags li{color:var(--muted);border:1px solid var(--line);border-radius:2px;padding:4px 10px;font-size:12.5px}
.tag-label{margin-bottom:10px}

.fig{display:flex;flex-direction:column;gap:18px}
.tilt-wrap{perspective:1200px}
.tilt{transform-style:preserve-3d;transform:rotateX(var(--rx,7deg)) rotateY(var(--ry,-11deg));transition:transform .18s ease-out}
.layers{display:flex;flex-direction:column;gap:22px;padding:8px}
.lrow{display:flex;gap:14px;transform:translateZ(calc(var(--z)*1px));transform-style:preserve-3d}
.node{flex:1;min-width:0;border:1px solid var(--line);background:var(--panel);border-radius:2px;padding:14px 16px;box-shadow:0 18px 30px -18px rgba(0,0,0,.7)}
.node.accent{border-color:var(--lime)}.node.dashed{border-style:dashed}
.node-t{font-weight:500;font-size:15px}

.mapstage{position:relative;height:380px;transform-style:preserve-3d}
.mapplane,.mapover{position:absolute;inset:0}
.mapplane{border:1px solid var(--line);background:var(--panel);
  background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:40px 40px}
.mapover{transform:translateZ(38px);pointer-events:none}
.mapstage svg{width:100%;height:100%;display:block}
.road{fill:none;stroke:#34393a;stroke-width:8;stroke-linecap:round}.road.thin{stroke-width:3}
.route{fill:none;stroke:var(--lime);stroke-width:3;stroke-dasharray:8 6;stroke-linejoin:round}
.ring{fill:none;stroke:var(--lime);stroke-width:2}
.pin{fill:var(--lime);stroke:#121314;stroke-width:2}
.pin-t{font:700 13px "Bricolage Grotesque",sans-serif;fill:#121314}
.floaters li{position:absolute;transform:translateZ(calc(var(--z)*1px));background:var(--bg);border:1px solid var(--lime);color:var(--lime);border-radius:2px;padding:4px 10px;font-size:12.5px;box-shadow:0 14px 24px -12px rgba(0,0,0,.8)}

.two{display:grid}
@media(min-width:1000px){.two{grid-template-columns:1fr 1fr}.two .proj:first-child{border-right:1px solid var(--line)}}
.half{padding-left:clamp(20px,4vw,40px);padding-right:clamp(20px,4vw,40px)}
.inner{max-width:620px;margin:0 auto;display:flex;flex-direction:column;gap:36px;width:100%}
@media(min-width:1000px){.two .proj:first-child .inner{margin-left:auto;margin-right:0}.two .proj:last-child .inner{margin-left:0;margin-right:auto}}
.gap{margin:0}
.ruled{border-top:1px solid var(--line);padding-top:22px;margin-bottom:-18px}
.figs{display:flex;flex-direction:column;gap:10px;font-size:15px}

.other,.about{border-bottom:1px solid var(--line)}
.other{padding:80px 0}
.about{padding:96px 0;border-bottom:0}
.other-in{display:grid;gap:36px}
@media(min-width:800px){.other-in{grid-template-columns:1fr 2fr}}
.olist{border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.olist li{padding:20px 0}.olist li+li{border-top:1px solid var(--line)}
.olist .small{margin-top:4px}
.about-lead{font-size:22px;line-height:1.45}

.foot{border-top:1px solid var(--line)}
.foot-in{display:flex;flex-direction:column;gap:12px;padding-top:32px;padding-bottom:32px}
.foot ul{display:flex;gap:24px}
@media(min-width:600px){.foot-in{flex-direction:row;align-items:center;justify-content:space-between}}


.chart{border:1px solid var(--line);background:var(--panel);border-radius:2px;padding:20px;display:flex;flex-direction:column;gap:16px;min-width:0}
.chart-t{font-weight:500;font-size:15px}
.svg-chart{width:100%;height:auto;display:block}
.grid-l{stroke:var(--line);stroke-width:1}
.ax{fill:var(--muted);font:11px "JetBrains Mono",ui-monospace,monospace}
.series{fill:none;stroke:var(--fg);stroke-width:1.5;stroke-linejoin:round;opacity:.85}
.flag-ring{fill:none;stroke:var(--lime);stroke-width:1.5}
.flag-dot{fill:var(--lime)}
.band{fill:var(--lime)}
.bars{display:flex;flex-direction:column;gap:14px}
.bar-row{display:grid;grid-template-columns:78px 1fr 72px;align-items:center;gap:12px}
.bar{height:10px;background:var(--line);border-radius:1px}
.bar i{display:block;height:100%;background:var(--muted)}
.bar i.on{background:var(--lime)}
.stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 20px;border-top:1px solid var(--line);padding-top:18px}
.stats dt{color:var(--muted);font-size:12.5px}
.stats dd{font-size:22px;font-weight:500;margin-top:2px}
.bands{display:flex;height:44px;border:1px solid var(--line)}
.bands>div{display:flex;align-items:center;padding:0 8px;font-size:12px;color:var(--muted);overflow:hidden;white-space:nowrap}
.bands>div+div{border-left:1px solid var(--line)}
.bands .mid{color:var(--fg)}
.bands .hot{background:var(--lime);color:#121314}
.band-ticks{display:flex;justify-content:space-between}
.pipe{position:relative;display:flex;flex-direction:column;gap:20px;padding-left:28px}
.pipe::before{content:"";position:absolute;left:5px;top:8px;bottom:8px;width:1px;background:var(--line)}
.pipe li{position:relative}
.pipe li::before{content:"";position:absolute;left:-28px;top:6px;width:11px;height:11px;border:1px solid var(--lime);background:var(--bg);border-radius:50%}
.split.sub{margin-top:72px;align-items:start}
.gap-lg{margin-top:56px}
.col{display:flex;flex-direction:column;gap:24px;min-width:0}
@media(max-width:480px){.bar-row{grid-template-columns:64px 1fr 64px}.stats dd{font-size:19px}}

@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .kk *,.kk *::before,.kk *::after{animation:none!important;transition:none!important}
  .scene{transform:rotateX(58deg) rotateZ(-38deg)}
  .tilt{transform:rotateX(7deg) rotateY(-11deg)!important}
}
`;
