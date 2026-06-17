import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "./api";

/* ============================================================
   HACKCLUB — LANDING PAGE
   Theme: black / crimson / paper (matches admin portal palette)
   Display: Unbounded · Body: Space Grotesk · Mono: JetBrains Mono
   Signature: circuit-trace SVG navigation rail
   ============================================================ */

const ORANGE = "#ac120c"; // reddish-orange
const AMBER = "#d07d22"; // warm highlight
const INK = "#020000";
const PAPER = "#f4ede4";

/* ---------------- data ---------------- */

const STATS = [
  { value: 250, suffix: "+", label: "Active Members" },
  { value: 40, suffix: "+", label: "Projects Completed" },
  { value: 20, suffix: "+", label: "Hackathons" },
  { value: 20, suffix: "+", label: "Workshops" },
];

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "events", label: "Events" },
  { id: "team", label: "Team" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

const EVENTS = [
  {
    id: "hacknight",
    tag: "HACKATHON",
    name: "HackNight 24-25",
    date: "March 1-3, 2025",
    desc: "Our flagship 48h build hackathon.",
    image: "/images/hacknight.jpg",
    seed: 7,
  },
  {
    id: "webdev",
    tag: "WORKSHOP",
    name: "WebVerse",
    date: "August 8, 2025",
    desc: "A hands-on workshop taking absolute beginners from a blank file to a deployed personal site in one afternoon.",
    image: "/images/webverse.jpg",
    seed: 3,
  },
  {
    id: "hackwell",
    tag: "HACKATHON",
    name: "Hackwell",
    date: "September 15, 2025",
    desc: "One Day Hackathon. Sponsored by WellDoc.",
    image: "/images/hackwell.jpg",
    seed: 7,
  },
  {
    id: "epoch",
    tag: "BUILDATHON",
    name: "Epochesque",
    date: "September 22-23, 2025",
    desc: "2 day high powered buildathon along with speaker session by Sudhakar Rayavaram",
    image: "/images/epoch.jpg",
    seed: 7,
  },
  {
    id: "debug",
    tag: "EVENT",
    name: "Debug The Drama",
    date: "October 31, 2025",
    desc: "Decode the clues, spark your creativity, and race against time to debug the drama!",
    image: "/images/debug-the-drama.jpg",
    seed: 7,
  },
  {
    id: "sketch2stage",
    tag: "EVENT",
    name: "Sketch2Stage",
    date: "October 31, 2025",
    desc: "A UI/UX design and prototyping competition where participants sketch a concept, design it using digital tools like Figma, and pitch their final creation to the judges.",
    image: "/images/sketch2stage.jpg",
    seed: 7,
  },
  {
    id: "codegolf",
    tag: "EVENT",
    name: "Code Golf",
    date: "November 1, 2025",
    desc: "A competitive solo programming challenge where you must solve problems using the fewest possible characters because the shortest code wins.",
    image: "/images/code-golf.jpg",
    seed: 7,
  },
  {
    id: "finedge hackathon",
    tag: "HACKATHON",
    name: "VInd FinEdge Hackathon",
    date: "April 6, 2026",
    desc: "A multi-stage financial technology hackathon backed by the Ministry of Finance where teams submit ideas, develop prototypes, and present fintech solutions for cash prizes and internship opportunities.",
    image: "/images/finedge-hackathon.jpg",
    seed: 7,
  },
  {
    id: "transferlearning",
    tag: "WORKSHOP",
    name: "Introduction to Transfer Learning - The Backbone of Modern AI.",
    date: "June 28, 2026",
    desc: "A free educational online workshop led by an IIT Ropar PhD scholar introducing Transfer Learning, the foundational technique behind modern artificial intelligence.",
    // image: "/images/finedge-hackathon.jpg",
    seed: 7,
  },
];

const BOARD = [
  { name: "Atul Krishnan", role: "Chairperson", tag: "BOARD", blurb: "", deg: 0 },
  { name: "Harleen", role: "Vice Chairperson", tag: "BOARD", blurb: "\"I don't exist\"", deg: 90 },
  { name: "Ojas Singh", role: "Secretary", tag: "BOARD", blurb: "The calm behind the calendar chaos.", deg: 180 },
  { name: "Ivan George", role: "Co-Secretry", tag: "BOARD", blurb: '"I don\'t know what\'s going on either, but I\'m here."', deg: 270 },
];

const CORE = [
  { name: "Prachi", role: "Projects Lead" },
  { name: "Manan", role: "R&D Lead" },
  { name: "Jesta", role: "Technical Lead" },
  { name: "Kushagra", role: "Design Lead" },
  { name: "Arya", role: "Operations Lead" },
];

const FAQS = [
  {
    q: "Is HackClub about hacking?",
    a: "Not the hoodie-in-a-dark-room kind. \"Hack\" here means building clever things fast — websites, apps, hardware, models. We're a technical club for makers of every skill level.",
  },
  {
    q: "I've never written code. Can I still join?",
    a: "That's exactly who we built this for. Our workshops start from zero, and you'll always have seniors and core members around to unblock you. No task is insurmountable, no goal out of reach.",
  },
  {
    q: "What happens at a typical meet?",
    a: "Some weeks it's a workshop, some weeks a build night, some weeks a guest lecture. There's always a project on the table and pizza somewhere nearby.",
  },
  {
    q: "How do I become a board or core member?",
    a: "Show up, build things, help others. Consistency matters more than your resume.",
  },
  {
    q: "Does membership cost anything?",
    a: "No. Bring curiosity, leave with shipped projects. Sponsors and the institute cover the rest.",
  },
];

/* ---------------- hooks ---------------- */

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

function useInView(opts = { threshold: 0.25 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      opts
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView];
}

function useCountUp(target, run, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return val;
}

/* ---------------- starfield canvas ---------------- */

function Starfield({ reduced }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, stars, raf;
    const N = 120;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const init = () => {
      stars = Array.from({ length: N }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.2,
        v: Math.random() * 0.18 + 0.04,
        o: Math.random() * 0.6 + 0.15,
        orange: Math.random() < 0.18,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.globalAlpha = s.o;
        ctx.fillStyle = s.orange ? ORANGE : "#FFFFFF";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (!reduced) {
          s.y += s.v;
          if (s.y > h + 2) {
            s.y = -2;
            s.x = Math.random() * w;
          }
        }
      }
      ctx.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    resize();
    init();
    draw();
    const onResize = () => {
      resize();
      init();
      if (reduced) draw();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);
  return <canvas ref={canvasRef} className="hc-stars" aria-hidden="true" />;
}

/* ---------------- circuit nav rail (signature) ---------------- */

function CircuitNav({ active, onJump }) {
  // Vertical circuit trace with nodes; pulse travels the trace.
  const H = 460;
  const nodeYs = SECTIONS.map((_, i) => 40 + i * ((H - 80) / (SECTIONS.length - 1)));
  return (
    <nav className="hc-rail" aria-label="Section navigation">
      <svg viewBox={`0 0 64 ${H}`} width="64" height={H}>
        <defs>
          <linearGradient id="trace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.15" />
            <stop offset="50%" stopColor={ORANGE} stopOpacity="0.6" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0.15" />
          </linearGradient>
          <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* main trace with elbow detours like a PCB */}
        <path
          d={`M32 8
              V ${nodeYs[0] - 14} l 10 10 V ${nodeYs[1] - 10} l -10 10
              V ${nodeYs[2] - 14} l -10 10 V ${nodeYs[3] - 10} l 10 10
              V ${nodeYs[4] - 14} l 10 10 V ${nodeYs[5] - 10} l -10 10
              V ${H - 8}`}
          fill="none"
          stroke="url(#trace)"
          strokeWidth="2"
        />
        {/* travelling pulse */}
        <path
          className="hc-pulse"
          d={`M32 8
              V ${nodeYs[0] - 14} l 10 10 V ${nodeYs[1] - 10} l -10 10
              V ${nodeYs[2] - 14} l -10 10 V ${nodeYs[3] - 10} l 10 10
              V ${nodeYs[4] - 14} l 10 10 V ${nodeYs[5] - 10} l -10 10
              V ${H - 8}`}
          fill="none"
          stroke={AMBER}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* side stubs */}
        {nodeYs.map((y, i) => (
          <line
            key={`stub-${i}`}
            x1={i % 2 === 0 ? 42 : 22}
            y1={y}
            x2={i % 2 === 0 ? 54 : 10}
            y2={y}
            stroke={ORANGE}
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
        ))}
        {/* node pads */}
        {nodeYs.map((y, i) => {
          const x = i % 2 === 0 ? 42 : 22;
          const isActive = SECTIONS[i].id === active;
          return (
            <g
              key={SECTIONS[i].id}
              className="hc-node"
              onClick={() => onJump(SECTIONS[i].id)}
              role="button"
              tabIndex={0}
              aria-label={`Go to ${SECTIONS[i].label}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onJump(SECTIONS[i].id);
              }}
            >
              <circle cx={x} cy={y} r="11" fill="transparent" />
              <rect
                x={x - 5.5}
                y={y - 5.5}
                width="11"
                height="11"
                rx="2.5"
                transform={`rotate(45 ${x} ${y})`}
                fill={isActive ? ORANGE : INK}
                stroke={isActive ? AMBER : "rgba(172,18,12,0.5)"}
                strokeWidth="1.5"
                filter={isActive ? "url(#glow)" : undefined}
              />
              {isActive && (
                <circle cx={x} cy={y} r="2.2" fill="#fff" />
              )}
            </g>
          );
        })}
      </svg>
      <div className="hc-rail-label" key={active}>
        {SECTIONS.find((s) => s.id === active)?.label}
      </div>
    </nav>
  );
}

/* ---------------- glitch wordmark ---------------- */

function Wordmark() {
  return (
    <h1 className="hc-wordmark" data-text="HACKCLUB">
      HACK<span>CLUB</span>
    </h1>
  );
}

/* ---------------- boot terminal ---------------- */

const BOOT_LINES = [
  "$ ./hackclub --init",
  "loading modules: web ▸ ml ▸ hardware ▸ chaos",
  "members.connect(500+) ........ OK",
  "dreams.compile() ............. OK",
  "> making dreams a collective reality_",
];

function BootTerminal({ reduced }) {
  const [lines, setLines] = useState(reduced ? BOOT_LINES : []);
  const [li, setLi] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (reduced) return;
    if (li >= BOOT_LINES.length) return;
    const line = BOOT_LINES[li];
    if (chars < line.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 14 + Math.random() * 22);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLines((ls) => [...ls, line]);
      setLi((i) => i + 1);
      setChars(0);
    }, 180);
    return () => clearTimeout(t);
  }, [li, chars, reduced]);

  return (
    <div className="hc-terminal" aria-hidden="true">
      <div className="hc-terminal-bar">
        <i /><i /><i />
        <span>hackclub.sh</span>
      </div>
      <div className="hc-terminal-body">
        {lines.map((l, i) => (
          <div key={i} className={l.startsWith(">") ? "tl accent" : "tl"}>{l}</div>
        ))}
        {!reduced && li < BOOT_LINES.length && (
          <div className={BOOT_LINES[li].startsWith(">") ? "tl accent" : "tl"}>
            {BOOT_LINES[li].slice(0, chars)}
            <span className="caret">█</span>
          </div>
        )}
        {(reduced || li >= BOOT_LINES.length) && (
          <div className="tl accent"><span className="caret">█</span></div>
        )}
      </div>
    </div>
  );
}

/* ---------------- stat card ---------------- */

function StatCard({ value, suffix, label, delay }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const n = useCountUp(value, inView);
  return (
    <div ref={ref} className={`hc-stat ${inView ? "in" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="hc-stat-num">
        {n}
        <em>{suffix}</em>
      </div>
      <div className="hc-stat-label">{label}</div>
      <svg className="hc-stat-corner" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 22V10M2 2h12" stroke={ORANGE} strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
}

/* ---------------- generative event art ---------------- */

function EventArt({ seed }) {
  // deterministic pseudo-random pattern per event
  const rnd = (i) => {
    const x = Math.sin(seed * 999 + i * 137.13) * 43758.5453;
    return x - Math.floor(x);
  };
  const bars = Array.from({ length: 14 }, (_, i) => ({
    x: 8 + i * 20,
    h: 30 + rnd(i) * 90,
    o: 0.15 + rnd(i + 50) * 0.5,
    orange: rnd(i + 100) > 0.55,
  }));
  const dots = Array.from({ length: 10 }, (_, i) => ({
    cx: 12 + rnd(i + 200) * 270,
    cy: 12 + rnd(i + 300) * 130,
    r: 1.5 + rnd(i + 400) * 2.5,
  }));
  return (
    <svg viewBox="0 0 290 150" className="hc-event-art" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="290" height="150" fill="#120202" />
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={150 - b.h}
          width="9"
          height={b.h}
          fill={b.orange ? ORANGE : "#FFFFFF"}
          opacity={b.o}
        />
      ))}
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={AMBER} opacity="0.7" />
      ))}
      <path
        d={`M0 ${100 - rnd(1) * 40} L60 ${80 - rnd(2) * 30} L120 ${110 - rnd(3) * 50} L190 ${70 - rnd(4) * 30} L290 ${95 - rnd(5) * 40}`}
        stroke={ORANGE}
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />
      <text x="10" y="20" fill="rgba(244,237,228,0.35)" fontSize="9" fontFamily="monospace">
        {`img://events/${seed.toString(16).padStart(2, "0")} — drop your photo here`}
      </text>
    </svg>
  );
}

function EventCard({ ev, i }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return (
    <article ref={ref} className={`hc-event ${inView ? "in" : ""}`} style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
      <div className="hc-event-img">
        {ev.image ? (
          <img className="hc-event-image" src={ev.image} alt={ev.name} />
        ) : (
          <EventArt seed={ev.seed} />
        )}
        <span className="hc-event-tag">{ev.tag}</span>
      </div>
      <div className="hc-event-body">
        <div className="hc-event-date">{ev.date}</div>
        <h3>{ev.name}</h3>
        <p>{ev.desc}</p>
        {/* <button
          className="hc-event-cta"
          onClick={() => {
            const el = document.getElementById("contact");
            el && el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Notify me <span aria-hidden="true">→</span>
        </button> */}
      </div>
    </article>
  );
}

/* ---------------- orbital team deck ---------------- */

function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function OrbitDeck({ reduced }) {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const member = BOARD[selected];

  return (
    <div className="hc-orbit-wrap">
      <div
        className={`hc-orbit ${paused || reduced ? "paused" : ""}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* rings */}
        <svg className="hc-orbit-rings" viewBox="0 0 500 500" aria-hidden="true">
          <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(172,18,12,0.25)" strokeWidth="1" strokeDasharray="3 7" />
          <circle cx="250" cy="250" r="120" fill="none" stroke="rgba(244,237,228,0.12)" strokeWidth="1" />
          <circle cx="250" cy="250" r="238" fill="none" stroke="rgba(172,18,12,0.12)" strokeWidth="1" />
        </svg>

        {/* core */}
        <div className="hc-orbit-core">
          <div className="hc-core-pulse" />
          <span>HACK</span>
          <span className="o">CLUB</span>
          <small>BOARD '26</small>
        </div>

        {/* orbiting members */}
        <div className="hc-orbit-spin">
          {BOARD.map((m, idx) => (
            <div className="hc-orbit-slot" style={{ "--deg": `${m.deg}deg` }} key={m.name}>
              <button
                className={`hc-astro ${selected === idx ? "sel" : ""}`}
                onClick={() => setSelected(idx)}
                aria-label={`${m.name}, ${m.role}`}
              >
                <span className="hc-astro-ring" />
                {initials(m.name)}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* detail console */}
      <div className="hc-orbit-console" key={member.name}>
        <div className="hc-console-tag">{member.tag} // {String(selected + 1).padStart(2, "0")}</div>
        <h3>{member.name}</h3>
        <div className="hc-console-role">{member.role}</div>
        <p>{member.blurb}</p>
        <div className="hc-console-nav">
          <button onClick={() => setSelected((selected + BOARD.length - 1) % BOARD.length)} aria-label="Previous member">←</button>
          <button onClick={() => setSelected((selected + 1) % BOARD.length)} aria-label="Next member">→</button>
        </div>
      </div>
    </div>
  );
}

function CoreGrid() {
  return (
    <div className="hc-core-grid">
      {CORE.map((c, i) => (
        <div className="hc-core-chip" key={c.name} style={{ animationDelay: `${i * 60}ms` }}>
          <span className="hc-chip-init">{initials(c.name)}</span>
          <div>
            <strong>{c.name}</strong>
            <em>{c.role}</em>
          </div>
          <svg viewBox="0 0 12 12" className="hc-chip-pin" aria-hidden="true">
            <rect x="3" y="3" width="6" height="6" rx="1" transform="rotate(45 6 6)" fill={ORANGE} />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ---------------- FAQ ---------------- */

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="hc-faq">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div className={`hc-faq-item ${isOpen ? "open" : ""}`} key={i}>
            <button
              className="hc-faq-q"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
            >
              <span className="hc-faq-idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="hc-faq-text">{f.q}</span>
              <span className="hc-faq-plus" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            <div className="hc-faq-a" style={{ maxHeight: isOpen ? "200px" : "0px" }}>
              <p>{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- section header ---------------- */

function SectionHead({ kicker, title, children }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  return (
    <header ref={ref} className={`hc-sechead ${inView ? "in" : ""}`}>
      <div className="hc-kicker">
        <svg viewBox="0 0 18 18" width="14" height="14" aria-hidden="true">
          <rect x="4.5" y="4.5" width="9" height="9" rx="1.5" transform="rotate(45 9 9)" fill="none" stroke={ORANGE} strokeWidth="2" />
        </svg>
        {kicker}
      </div>
      <h2>{title}</h2>
      {children && <p className="hc-sechead-sub">{children}</p>}
    </header>
  );
}

/* ---------------- main ---------------- */

export default function HackClubLanding({ onLogin, onOpenRecruitment }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState("home");
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    api.getPublicLeaderboard()
      .then(data => {
        setLeaderboard(data);
      })
      .catch(err => {
        console.error("Failed to load public leaderboard for ticker:", err);
      });
  }, []);

  const jump = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  // scroll spy
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.4;
      let current = "home";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [aboutRef, aboutIn] = useInView({ threshold: 0.2 });

  return (
    <div className="hc-root">
      <style>{CSS}</style>
      <Starfield reduced={reduced} />
      <CircuitNav active={active} onJump={jump} />

      {/* ============ HERO ============ */}
      <section id="home" className="hc-hero">
        <div className="hc-hero-glow" aria-hidden="true" />
        <div className="hc-topbar">
          <div className="hc-logo" onClick={() => jump("home")} role="button" tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" ? jump("home") : null)}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <rect x="6" y="6" width="12" height="12" rx="2" transform="rotate(45 12 12)" fill="none" stroke={ORANGE} strokeWidth="2.4" />
              <circle cx="12" cy="12" r="2" fill={PAPER} />
            </svg>
            HACKCLUB
          </div>
          <div className="hc-topbar-right">
            <div className="hc-topbar-status">
              <span className="hc-dot" /> RECRUITMENT '26 — OFFLINE
            </div>
            <button className="hc-login" type="button" onClick={onLogin}>
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                <path d="M10 17l5-5-5-5M15 12H3M14 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Login
            </button>
          </div>
        </div>

        <div className="hc-hero-inner">
          <Wordmark />
          <p className="hc-tagline">Making dreams a collective reality.</p>
          <p className="hc-sub">
            A technical club for builders — web, ML, hardware and everything in between.
            No experience needed. Just bring the itch to make things.
          </p>

          <div className="hc-cta-row">
            {/* <a className="hc-btn solid" href="#" onClick={(e) => { e.preventDefault(); onOpenRecruitment(); }}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M5 19l6-6M14 4l6 6-9 9-6-6 9-9z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Recruitment Website
            </a> */}
            <a className="hc-btn ghost" href="https://discord.gg/zvvux9aAq" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M8.5 15.5c2.2 1 4.8 1 7 0M9 11h.01M15 11h.01M7 5c3.3-1.3 6.7-1.3 10 0l2 11c-1.5 1.6-3.3 2.5-5 3l-1-2h-2l-1 2c-1.7-.5-3.5-1.4-5-3L7 5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              Join Discord
            </a>
          </div>

          <BootTerminal reduced={reduced} />
        </div>

        <div className="hc-stats">
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 100} />
          ))}
        </div>

        {leaderboard && leaderboard.some((member) => (member.totalScore || 0) > 0) && (() => {
          const visibleLeaderboard = leaderboard.filter((member) => (member.totalScore || 0) > 0);
          return (
            <div className="hc-leaderboard-ticker-wrap">
              <div className="hc-ticker-title">
                <span className="live-badge">LIVE</span> LEADERBOARD RANKINGS
              </div>
              <div className="hc-ticker-container">
                <div className="hc-ticker-track">
                  {/* Double the list to ensure infinite seamless scrolling */}
                  {[...visibleLeaderboard, ...visibleLeaderboard].map((member, index) => {
                    const rank = (index % visibleLeaderboard.length) + 1;
                    return (
                      <div key={`${member.id}-${index}`} className="hc-ticker-item">
                        <span className="hc-ticker-rank">#{rank}</span>
                        <span className="hc-ticker-name">{member.name}</span>
                        <span className="hc-ticker-score">{member.totalScore} pts</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        <button className="hc-scrollcue" onClick={() => jump("about")} aria-label="Scroll to About">
          <svg viewBox="0 0 24 40" width="20" height="34">
            <rect x="4" y="2" width="16" height="30" rx="8" fill="none" stroke="rgba(244,237,228,0.4)" strokeWidth="1.5" />
            <circle className="hc-wheel" cx="12" cy="11" r="2.4" fill={ORANGE} />
          </svg>
        </button>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="hc-section">
        <SectionHead kicker="WHO WE ARE" title="About Us" />
        <div ref={aboutRef} className={`hc-about ${aboutIn ? "in" : ""}`}>
          <div className="hc-about-text">
            <p className="hc-lede">
              We're a group of enthusiastic students building an inclusive environment for
              anyone starting out with tech projects.
            </p>
            <p>
              The name says hack, but nobody's breaking into anything — we hack in the original
              sense: clever, fast, joyful building. From your first <code>console.log</code> to
              shipping models in production, there's a seat and a senior for you here.
            </p>
            <p className="hc-creed">
              We firmly believe <strong>no task is insurmountable</strong> and{" "}
              <strong>no goal is out of reach</strong>.
            </p>
          </div>
          <div className="hc-about-panel">
            <div className="hc-panel-row"><span>// domains</span>web · app · ml · hardware · systems</div>
            <div className="hc-panel-row"><span>// founded</span>2021, by 6 students and one whiteboard</div>
            <div className="hc-panel-row"><span>// meets</span>every week, all semester</div>
            <div className="hc-panel-row"><span>// entry barrier</span>none. seriously.</div>
            <div className="hc-panel-bars" aria-hidden="true">
              {[68, 90, 45, 78, 58, 84, 36, 95, 62, 74].map((h, i) => (
                <i key={i} style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ EVENTS ============ */}
      <section id="events" className="hc-section">
        <SectionHead kicker="ON THE LAUNCHPAD" title="Our Memorable Events">
          Workshops, hackathons, guest lectures and collaborative build nights — here's what's
          coming and what we've been shipping. Swap in your own photos where the placeholders sit.
        </SectionHead>
        <div className="hc-events">
          {EVENTS.map((ev, i) => (
            <EventCard ev={ev} i={i} key={ev.id} />
          ))}
        </div>
      </section>

      {/* ============ TEAM ============ */}
      <section id="team" className="hc-section">
        <SectionHead kicker="MISSION CONTROL" title="The Board">
          Six people in orbit around one idea. Click a satellite — or let the ring drift and
          catch them as they pass.
        </SectionHead>
        <OrbitDeck reduced={reduced} />

        <div className="hc-coretitle">
          <span className="hc-kicker">
            <svg viewBox="0 0 18 18" width="14" height="14" aria-hidden="true">
              <rect x="4.5" y="4.5" width="9" height="9" rx="1.5" transform="rotate(45 9 9)" fill="none" stroke={ORANGE} strokeWidth="2" />
            </svg>
            GROUND CREW
          </span>
          <h3>The Core</h3>
        </div>
        <CoreGrid />
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="hc-section">
        <SectionHead kicker="BEFORE YOU ASK" title="FAQs" />
        <Faq />
      </section>

      {/* ============ CONTACT / FOOTER ============ */}
      <footer id="contact" className="hc-footer">
        <div className="hc-footer-inner">
          <h2>
            Ready to build<span className="o">?</span>
          </h2>
          <p>Recruitment for 2026 is Offline. Wait Eagerly</p>
          <div className="hc-cta-row center">
            {/* <a className="hc-btn solid" href="#" onClick={(e) => { e.preventDefault(); onOpenRecruitment(); }}>
              Apply now
            </a> */}
            {/* <a className="hc-btn ghost" href="mailto:hello@hackclub.example">
              hello@hackclub.example
            </a> */}
          </div>
          <div className="hc-footer-meta">
            <span>© 2026 HACKCLUB</span>
            <span className="hc-footer-trace" aria-hidden="true">
              <svg viewBox="0 0 220 12" width="220" height="12">
                <path d="M0 6 H60 l6 -5 h30 l6 5 h40 l6 5 h30 l6 -5 H220" fill="none" stroke={ORANGE} strokeOpacity="0.5" strokeWidth="1.5" />
                <circle cx="110" cy="6" r="2.5" fill={ORANGE} />
              </svg>
            </span>
            <span>BUILT BY MEMBERS, FOR MEMBERS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================ CSS */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap');

:root {
  --ink: ${INK};
  --carbon: #120202;
  --line: rgba(244,237,228,0.1);
  --orange: ${ORANGE};
  --amber: ${AMBER};
  --paper: ${PAPER};
  --mute: #bfa8a2;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

.hc-root {
  background: var(--ink);
  color: var(--paper);
  font-family: 'Space Grotesk', sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
}
.hc-root ::selection { background: var(--orange); color: #000; }

.hc-stars {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
}

/* ---------- circuit rail ---------- */
.hc-rail {
  position: fixed; right: 14px; top: 50%; transform: translateY(-50%);
  z-index: 50; display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.hc-node { cursor: pointer; }
.hc-node:focus-visible rect { stroke: #fff; stroke-width: 2.5; }
.hc-node rect { transition: fill .25s, stroke .25s; }
.hc-node:hover rect { stroke: var(--amber); }
.hc-pulse {
  stroke-dasharray: 30 900;
  animation: hc-pulse-run 5s linear infinite;
  opacity: .9;
}
@keyframes hc-pulse-run {
  from { stroke-dashoffset: 930; }
  to { stroke-dashoffset: 0; }
}
.hc-rail-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .2em;
  color: var(--orange); text-transform: uppercase; writing-mode: vertical-rl;
  animation: hc-fadein .4s ease both;
}

/* ---------- hero ---------- */
.hc-hero {
  position: relative; z-index: 1; min-height: 100vh;
  display: flex; flex-direction: column; align-items: center;
  padding: 0 24px 90px;
}
.hc-hero-glow {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 90% 55% at 50% -12%, rgba(172,18,12,0.5), transparent 62%),
    radial-gradient(ellipse 45% 30% at 78% 0%, rgba(208,125,34,0.22), transparent 70%);
}
.hc-topbar {
  width: 100%; max-width: 1180px; display: flex; justify-content: space-between;
  align-items: center; padding: 26px 0; position: relative;
}
.hc-logo {
  display: flex; align-items: center; gap: 10px; cursor: pointer;
  font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: .14em;
}
.hc-topbar-right { display: flex; align-items: center; gap: 12px; }
.hc-login {
  display: inline-flex; align-items: center; gap: 8px; border: 0; cursor: pointer;
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px;
  letter-spacing: .06em; text-transform: uppercase; text-decoration: none;
  color: #000; background: var(--orange); padding: 9px 18px;
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
  transition: background .2s, transform .2s, box-shadow .2s;
}
.hc-login:hover {
  background: var(--amber); transform: translateY(-2px);
  box-shadow: 0 8px 26px rgba(172,18,12,0.45);
}
.hc-topbar-status {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .18em;
  color: var(--mute); display: flex; align-items: center; gap: 8px;
  border: 1px solid var(--line); border-radius: 99px; padding: 7px 14px;
  background: rgba(2,0,0,0.45); backdrop-filter: blur(4px);
}
.hc-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--orange);
  box-shadow: 0 0 10px var(--orange); animation: hc-blink 1.6s ease infinite;
}
@keyframes hc-blink { 50% { opacity: .35; } }

.hc-hero-inner {
  position: relative; text-align: center; margin-top: clamp(28px, 7vh, 80px);
  display: flex; flex-direction: column; align-items: center;
  animation: hc-rise .9s cubic-bezier(.2,.8,.2,1) both;
}
@keyframes hc-rise { from { opacity: 0; transform: translateY(26px); } }

.hc-wordmark {
  font-family: 'Unbounded', sans-serif; font-weight: 900;
  font-size: clamp(44px, 9.5vw, 118px); line-height: .95; letter-spacing: -0.01em;
  position: relative; color: var(--paper);
}
.hc-wordmark span { color: var(--orange); }
.hc-wordmark::before, .hc-wordmark::after {
  content: attr(data-text); position: absolute; inset: 0; pointer-events: none;
  clip-path: inset(0 0 0 0);
}
.hc-wordmark::before {
  color: var(--orange); animation: hc-glitch1 5s steps(1) infinite; opacity: .7;
}
.hc-wordmark::after {
  color: #fff; animation: hc-glitch2 5s steps(1) infinite; opacity: .5;
}
@keyframes hc-glitch1 {
  0%, 92%, 100% { transform: none; clip-path: inset(100% 0 0 0); }
  93% { transform: translate(-4px, 2px); clip-path: inset(12% 0 76% 0); }
  95% { transform: translate(3px, -2px); clip-path: inset(58% 0 28% 0); }
  97% { transform: none; clip-path: inset(100% 0 0 0); }
}
@keyframes hc-glitch2 {
  0%, 93%, 100% { transform: none; clip-path: inset(100% 0 0 0); }
  94% { transform: translate(4px, 1px); clip-path: inset(78% 0 8% 0); }
  96% { transform: translate(-3px, -1px); clip-path: inset(30% 0 58% 0); }
  98% { transform: none; clip-path: inset(100% 0 0 0); }
}

.hc-tagline {
  margin-top: 22px; font-size: clamp(17px, 2.2vw, 22px); font-weight: 500;
  color: var(--paper);
}
.hc-sub {
  margin-top: 12px; max-width: 560px; color: var(--mute); font-size: 15.5px; line-height: 1.65;
}
.hc-cta-row {
  margin-top: 32px; display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;
}
.hc-cta-row.center { justify-content: center; }
.hc-btn {
  display: inline-flex; align-items: center; gap: 9px;
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14.5px;
  letter-spacing: .02em; text-decoration: none; padding: 14px 26px; border-radius: 4px;
  transition: transform .2s, box-shadow .2s, background .2s, color .2s;
  cursor: pointer;
}
.hc-btn.solid {
  background: var(--orange); color: #000;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}
.hc-btn.solid:hover { background: var(--amber); transform: translateY(-2px); box-shadow: 0 10px 34px rgba(172,18,12,0.4); }
.hc-btn.ghost {
  border: 1px solid rgba(172,18,12,0.55); color: var(--paper); background: rgba(172,18,12,0.06);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}
.hc-btn.ghost:hover { background: rgba(172,18,12,0.16); transform: translateY(-2px); }

/* terminal */
.hc-terminal {
  margin-top: 46px; width: min(620px, 100%); text-align: left;
  border: 1px solid var(--line); border-radius: 10px; overflow: hidden;
  background: rgba(18,2,2,0.8); backdrop-filter: blur(6px);
  box-shadow: 0 24px 70px rgba(0,0,0,0.55);
}
.hc-terminal-bar {
  display: flex; align-items: center; gap: 7px; padding: 10px 14px;
  border-bottom: 1px solid var(--line); background: rgba(255,255,255,0.03);
}
.hc-terminal-bar i { width: 10px; height: 10px; border-radius: 50%; background: rgba(244,237,228,0.16); }
.hc-terminal-bar i:first-child { background: var(--orange); }
.hc-terminal-bar span {
  margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--mute);
}
.hc-terminal-body {
  padding: 16px 18px 18px; font-family: 'JetBrains Mono', monospace; font-size: 13px;
  line-height: 1.85; min-height: 132px;
}
.tl { color: var(--mute); white-space: pre-wrap; }
.tl.accent { color: var(--orange); font-weight: 700; }
.caret { animation: hc-blink 1s steps(1) infinite; color: var(--orange); }

/* stats */
.hc-stats {
  margin-top: 70px; width: 100%; max-width: 1180px;
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; position: relative;
}
.hc-stat {
  position: relative; border: 1px solid var(--line); border-radius: 10px;
  padding: 26px 24px; background: rgba(18,2,2,0.6); backdrop-filter: blur(4px);
  opacity: 0; transform: translateY(18px);
  transition: opacity .6s ease, transform .6s ease, border-color .25s;
}
.hc-stat.in { opacity: 1; transform: none; }
.hc-stat:hover { border-color: rgba(172,18,12,0.5); }
.hc-stat-num {
  font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: clamp(30px, 3.4vw, 42px);
}
.hc-stat-num em { font-style: normal; color: var(--orange); }
.hc-stat-label {
  margin-top: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--mute);
}
.hc-stat-corner { position: absolute; left: 10px; bottom: 10px; width: 16px; height: 16px; opacity: .8; }

.hc-scrollcue {
  margin-top: 64px; background: none; border: 0; cursor: pointer; opacity: .8;
  transition: opacity .2s, transform .2s;
}
.hc-scrollcue:hover { opacity: 1; transform: translateY(3px); }
.hc-wheel { animation: hc-wheel 1.8s ease infinite; }
@keyframes hc-wheel { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(12px); opacity: 0; } 100% { opacity: 0; } }

/* ---------- sections ---------- */
.hc-section {
  position: relative; z-index: 1; max-width: 1180px; margin: 0 auto;
  padding: clamp(80px, 12vh, 130px) 24px 0;
}
.hc-sechead { max-width: 760px; opacity: 0; transform: translateY(20px); transition: all .7s cubic-bezier(.2,.8,.2,1); }
.hc-sechead.in { opacity: 1; transform: none; }
.hc-kicker {
  display: inline-flex; align-items: center; gap: 9px;
  font-family: 'JetBrains Mono', monospace; font-size: 11.5px; letter-spacing: .26em;
  color: var(--orange); text-transform: uppercase;
}
.hc-sechead h2, .hc-coretitle h3 {
  font-family: 'Unbounded', sans-serif; font-weight: 700;
  font-size: clamp(30px, 4.6vw, 52px); margin-top: 16px; line-height: 1.08;
}
.hc-sechead-sub { margin-top: 16px; color: var(--mute); line-height: 1.7; font-size: 15.5px; }

/* about */
.hc-about {
  margin-top: 48px; display: grid; grid-template-columns: 1.2fr .8fr; gap: 40px;
  opacity: 0; transform: translateY(22px); transition: all .7s ease .1s;
}
.hc-about.in { opacity: 1; transform: none; }
.hc-about-text p { color: var(--mute); line-height: 1.75; font-size: 16px; margin-bottom: 18px; }
.hc-about-text .hc-lede { color: var(--paper); font-size: clamp(19px, 2.2vw, 24px); font-weight: 500; line-height: 1.5; }
.hc-about-text code {
  font-family: 'JetBrains Mono', monospace; font-size: .88em; color: var(--amber);
  background: rgba(172,18,12,0.1); padding: 2px 7px; border-radius: 4px;
}
.hc-creed strong { color: var(--orange); }
.hc-about-panel {
  border: 1px solid var(--line); border-radius: 10px; background: rgba(18,2,2,0.6);
  padding: 24px; font-family: 'JetBrains Mono', monospace; font-size: 13px;
  display: flex; flex-direction: column; gap: 14px; align-self: start;
}
.hc-panel-row { display: flex; flex-direction: column; gap: 3px; color: var(--paper); }
.hc-panel-row span { color: var(--orange); font-size: 11px; letter-spacing: .12em; }
.hc-panel-bars {
  margin-top: 8px; height: 70px; display: flex; align-items: flex-end; gap: 6px;
  border-top: 1px dashed var(--line); padding-top: 14px;
}
.hc-panel-bars i {
  flex: 1; background: linear-gradient(to top, rgba(172,18,12,0.85), rgba(208,125,34,0.25));
  border-radius: 2px 2px 0 0; animation: hc-bar 2.6s ease-in-out infinite alternate;
}
@keyframes hc-bar { from { transform: scaleY(.55); } to { transform: scaleY(1); } }
.hc-panel-bars i { transform-origin: bottom; }

/* events */
.hc-events {
  margin-top: 52px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
}
.hc-event {
  border: 1px solid var(--line); border-radius: 12px; overflow: hidden;
  background: rgba(18,2,2,0.65); display: flex; flex-direction: column;
  opacity: 0; transform: translateY(24px);
  transition: opacity .6s ease, transform .6s ease, border-color .25s, box-shadow .25s;
}
.hc-event.in { opacity: 1; transform: none; }
.hc-event:hover { border-color: rgba(172,18,12,0.55); box-shadow: 0 18px 50px rgba(172,18,12,0.12); }
.hc-event-img { position: relative; }
.hc-event-art,
.hc-event-image { display: block; width: 100%; height: 150px; object-fit: cover; }
.hc-event-tag {
  position: absolute; top: 12px; right: 12px;
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .18em;
  background: #000; border: 1px solid rgba(172,18,12,0.6); color: var(--orange);
  padding: 5px 10px; border-radius: 99px;
}
.hc-event-body { padding: 20px 22px 22px; display: flex; flex-direction: column; flex: 1; }
.hc-event-date {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .2em; color: var(--mute);
}
.hc-event-body h3 {
  font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 19px; margin-top: 8px;
}
.hc-event-body p { margin-top: 10px; color: var(--mute); font-size: 14px; line-height: 1.65; flex: 1; }
.hc-event-cta {
  margin-top: 18px; align-self: flex-start; background: none; border: 0;
  color: var(--orange); font-family: 'Space Grotesk', sans-serif; font-weight: 700;
  font-size: 14px; cursor: pointer; display: inline-flex; gap: 7px; align-items: center;
  transition: gap .2s, color .2s; padding: 4px 0;
}
.hc-event-cta:hover { gap: 12px; color: var(--amber); }

/* ---------- orbit team ---------- */
.hc-orbit-wrap {
  margin-top: 56px; display: grid; grid-template-columns: 1fr 360px; gap: 40px; align-items: center;
}
.hc-orbit {
  position: relative; width: min(500px, 92vw); aspect-ratio: 1; margin: 0 auto;
}
.hc-orbit-rings { position: absolute; inset: 0; width: 100%; height: 100%; animation: hc-ringspin 90s linear infinite; }
@keyframes hc-ringspin { to { transform: rotate(360deg); } }
.hc-orbit.paused .hc-orbit-rings,
.hc-orbit.paused .hc-orbit-spin,
.hc-orbit.paused .hc-orbit-slot .hc-astro { animation-play-state: paused; }
.hc-orbit-core {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 168px; height: 168px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #1a0606, #0a0202);
  border: 1px solid rgba(172,18,12,0.45);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-family: 'Unbounded', sans-serif; font-weight: 900; font-size: 21px; line-height: 1.1;
  box-shadow: 0 0 70px rgba(172,18,12,0.25), inset 0 0 40px rgba(172,18,12,0.12);
  z-index: 2;
}
.hc-orbit-core .o { color: var(--orange); }
.hc-orbit-core small {
  margin-top: 8px; font-family: 'JetBrains Mono', monospace; font-weight: 400;
  font-size: 9.5px; letter-spacing: .3em; color: var(--mute);
}
.hc-core-pulse {
  position: absolute; inset: -1px; border-radius: 50%;
  border: 1px solid rgba(172,18,12,0.6); animation: hc-corepulse 2.8s ease-out infinite;
}
@keyframes hc-corepulse {
  from { transform: scale(1); opacity: .8; }
  to { transform: scale(1.55); opacity: 0; }
}
.hc-orbit-spin {
  position: absolute; inset: 0; animation: hc-spin 36s linear infinite;
}
@keyframes hc-spin { to { transform: rotate(360deg); } }
.hc-orbit-slot {
  position: absolute; left: 50%; top: 50%;
  transform: rotate(var(--deg)) translateY(-190px);
}
.hc-astro {
  width: 64px; height: 64px; border-radius: 50%;
  transform: translate(-50%, -50%) rotate(calc(-1 * var(--deg)));
  animation: hc-counterspin 36s linear infinite;
  background: var(--carbon); border: 1.5px solid rgba(244,237,228,0.25);
  color: var(--paper); font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 15px;
  cursor: pointer; position: relative;
  transition: border-color .25s, box-shadow .25s, background .25s, color .25s;
}
@keyframes hc-counterspin { to { transform: translate(-50%, -50%) rotate(calc(-1 * var(--deg) - 360deg)); } }
.hc-astro:hover { border-color: var(--amber); }
.hc-astro.sel {
  background: var(--orange); color: #000; border-color: var(--amber);
  box-shadow: 0 0 34px rgba(172,18,12,0.65);
}
.hc-astro-ring {
  position: absolute; inset: -7px; border-radius: 50%;
  border: 1px dashed rgba(172,18,12,0.45);
}
.hc-orbit-console {
  border: 1px solid var(--line); border-left: 3px solid var(--orange);
  border-radius: 10px; background: rgba(18,2,2,0.7); padding: 28px;
  animation: hc-fadein .35s ease both;
}
@keyframes hc-fadein { from { opacity: 0; transform: translateY(8px); } }
.hc-console-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .22em; color: var(--orange);
}
.hc-orbit-console h3 {
  font-family: 'Unbounded', sans-serif; font-size: 23px; font-weight: 700; margin-top: 12px;
}
.hc-console-role {
  margin-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px;
  letter-spacing: .12em; text-transform: uppercase; color: var(--mute);
}
.hc-orbit-console p { margin-top: 16px; color: var(--mute); line-height: 1.7; font-size: 14.5px; }
.hc-console-nav { margin-top: 22px; display: flex; gap: 10px; }
.hc-console-nav button {
  width: 42px; height: 42px; border-radius: 6px; border: 1px solid rgba(172,18,12,0.5);
  background: rgba(172,18,12,0.07); color: var(--orange); font-size: 17px; cursor: pointer;
  transition: background .2s, transform .2s;
}
.hc-console-nav button:hover { background: rgba(172,18,12,0.2); transform: translateY(-2px); }

/* core grid */
.hc-coretitle { margin-top: 90px; }
.hc-coretitle h3 { font-size: clamp(24px, 3.4vw, 38px); }
.hc-core-grid {
  margin-top: 36px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
}
.hc-core-chip {
  position: relative; display: flex; align-items: center; gap: 14px;
  border: 1px solid var(--line); border-radius: 10px; padding: 16px 18px;
  background: rgba(18,2,2,0.6); transition: border-color .25s, transform .25s;
  animation: hc-fadein .5s ease both;
}
.hc-core-chip:hover { border-color: rgba(172,18,12,0.55); transform: translateY(-3px); }
.hc-chip-init {
  width: 44px; height: 44px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 13px;
  background: rgba(172,18,12,0.12); border: 1px solid rgba(172,18,12,0.45); color: var(--orange);
}
.hc-core-chip strong { display: block; font-size: 14.5px; }
.hc-core-chip em {
  display: block; font-style: normal; font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: .12em; color: var(--mute); margin-top: 3px; text-transform: uppercase;
}
.hc-chip-pin { position: absolute; top: 10px; right: 10px; width: 9px; height: 9px; opacity: .8; }

/* faq */
.hc-faq { margin-top: 44px; max-width: 820px; }
.hc-faq-item { border-bottom: 1px solid var(--line); }
.hc-faq-item:first-child { border-top: 1px solid var(--line); }
.hc-faq-q {
  width: 100%; display: flex; align-items: center; gap: 20px; text-align: left;
  background: none; border: 0; color: var(--paper); cursor: pointer; padding: 24px 6px;
  font-family: 'Space Grotesk', sans-serif; transition: color .2s;
}
.hc-faq-q:hover .hc-faq-text { color: var(--amber); }
.hc-faq-idx {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--orange); letter-spacing: .1em;
}
.hc-faq-text { flex: 1; font-size: clamp(15.5px, 1.8vw, 18px); font-weight: 500; transition: color .2s; }
.hc-faq-plus {
  font-size: 22px; color: var(--orange); width: 28px; text-align: center;
  transition: transform .3s;
}
.hc-faq-item.open .hc-faq-plus { transform: rotate(180deg); }
.hc-faq-a {
  overflow: hidden; transition: max-height .4s cubic-bezier(.2,.8,.2,1);
}
.hc-faq-a p { padding: 0 50px 24px; color: var(--mute); line-height: 1.7; font-size: 15px; }

/* footer */
.hc-footer {
  position: relative; z-index: 1; margin-top: clamp(90px, 14vh, 150px);
  border-top: 1px solid var(--line);
  background:
    radial-gradient(ellipse 75% 90% at 50% 115%, rgba(172,18,12,0.3), transparent 65%),
    rgba(10,1,1,0.7);
}
.hc-footer-inner {
  max-width: 1180px; margin: 0 auto; padding: 90px 24px 46px; text-align: center;
}
.hc-footer h2 {
  font-family: 'Unbounded', sans-serif; font-weight: 900; font-size: clamp(34px, 6vw, 66px);
}
.hc-footer h2 .o { color: var(--orange); }
.hc-footer p { margin-top: 14px; color: var(--mute); font-size: 16px; }
.hc-footer .hc-cta-row { margin-top: 34px; }
.hc-footer-meta {
  margin-top: 80px; display: flex; align-items: center; justify-content: space-between; gap: 18px;
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .2em; color: var(--mute);
  flex-wrap: wrap;
}

/* ---------- responsive ---------- */
@media (max-width: 1024px) {
  .hc-stats { grid-template-columns: repeat(2, 1fr); }
  .hc-events { grid-template-columns: repeat(2, 1fr); }
  .hc-core-grid { grid-template-columns: repeat(2, 1fr); }
  .hc-orbit-wrap { grid-template-columns: 1fr; }
  .hc-orbit-console { max-width: 520px; margin: 0 auto; width: 100%; }
}
@media (max-width: 640px) {
  .hc-rail { right: 4px; transform: translateY(-50%) scale(.82); }
  .hc-rail-label { display: none; }
  .hc-topbar-status { display: none; }
  .hc-events { grid-template-columns: 1fr; }
  .hc-core-grid { grid-template-columns: 1fr; }
  .hc-stats { grid-template-columns: 1fr 1fr; gap: 12px; }
  .hc-about { grid-template-columns: 1fr; }
  .hc-orbit-slot { transform: rotate(var(--deg)) translateY(-150px); }
  .hc-astro { width: 52px; height: 52px; font-size: 13px; }
  .hc-orbit-core { width: 130px; height: 130px; font-size: 16px; }
  .hc-faq-a p { padding-left: 38px; }
  .hc-footer-meta { justify-content: center; }
}

/* ---------- leaderboard ticker ---------- */
.hc-leaderboard-ticker-wrap {
  margin-top: 40px;
  width: 100%;
  max-width: 1180px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1;
  position: relative;
}
.hc-ticker-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: .2em;
  color: var(--mute);
  text-transform: uppercase;
}
.hc-ticker-title .live-badge {
  background: var(--orange);
  color: #000;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  animation: hc-pulse-opacity 1.5s infinite alternate;
}
@keyframes hc-pulse-opacity {
  from { opacity: 0.5; }
  to { opacity: 1; }
}
.hc-ticker-container {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  padding: 14px 0;
  background: rgba(18,2,2,0.4);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  position: relative;
}
.hc-ticker-container::before,
.hc-ticker-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100px;
  z-index: 2;
  pointer-events: none;
}
.hc-ticker-container::before {
  left: 0;
  background: linear-gradient(to right, var(--ink) 0%, transparent 100%);
}
.hc-ticker-container::after {
  right: 0;
  background: linear-gradient(to left, var(--ink) 0%, transparent 100%);
}
.hc-ticker-track {
  display: inline-flex;
  gap: 32px;
  animation: hc-marquee 25s linear infinite;
  width: max-content;
}
.hc-ticker-track:hover {
  animation-play-state: paused;
}
@keyframes hc-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.hc-ticker-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255,255,255,0.02);
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
  cursor: pointer;
}
.hc-ticker-item:hover {
  border-color: var(--orange);
  background: rgba(172,18,12,0.05);
  transform: translateY(-2px);
}
.hc-ticker-rank {
  font-family: 'JetBrains Mono', monospace;
  color: var(--orange);
  font-weight: 700;
  font-size: 12px;
}
.hc-ticker-name {
  font-weight: 500;
  font-size: 14px;
}
.hc-ticker-score {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--amber);
  background: rgba(208,125,34,0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .hc-orbit-spin, .hc-orbit-rings, .hc-astro, .hc-pulse, .hc-core-pulse,
  .hc-wordmark::before, .hc-wordmark::after, .hc-panel-bars i, .hc-wheel, .hc-ticker-track, .hc-ticker-title .live-badge {
    animation: none !important;
  }
  html { scroll-behavior: auto; }
}
`;
