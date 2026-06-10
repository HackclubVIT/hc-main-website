import { useState, useEffect, useRef } from "react";
import styles from "./ProjectUploadModal.module.css";

const STEPS = ["DETAILS", "TECH", "LINKS", "REVIEW"];
const TECH_OPTIONS = ["React", "Next.js", "Node.js", "Python", "FastAPI", "Django", "Flutter", "React Native", "TypeScript", "Go", "Rust", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "Redis", "TensorFlow", "PyTorch", "AWS", "Figma"];

// ── URL validation ──────────────────────────────────────────────
function isValidUrl(str) {
  if (!str.trim()) return null; // empty = no error (optional fields)
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidGithubUrl(str) {
  if (!str.trim()) return false;
  try {
    const url = new URL(str);
    return (url.protocol === "http:" || url.protocol === "https:") &&
           (url.hostname === "github.com" || url.hostname === "gitlab.com" || url.hostname === "bitbucket.org");
  } catch {
    return false;
  }
}

// ── Initials from name ──────────────────────────────────────────
function getInitials(name) {
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || "").join("").slice(0, 2);
}

const AVATAR_COLORS = [
  "hsl(350,50%,30%)", "hsl(210,50%,30%)", "hsl(140,40%,25%)",
  "hsl(40,50%,28%)", "hsl(270,40%,30%)", "hsl(180,40%,25%)",
];

export default function ProjectUploadModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    status: "Ongoing",
    tech: [],
    github: "",
    demo: "",
    members: [],       // array of strings
    mediaFiles: [],    // array of { name, type, preview }
  });

  // Step 2 local state
  const [memberInput, setMemberInput] = useState("");
  const [memberError, setMemberError] = useState("");
  const [urlTouched, setUrlTouched] = useState({ github: false, demo: false });
  const mediaInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleTech = (t) => {
    setForm(f => ({
      ...f,
      tech: f.tech.includes(t) ? f.tech.filter(x => x !== t) : [...f.tech, t],
    }));
  };

  // ── Member helpers ──────────────────────────────────────────
  const addMember = () => {
    const name = memberInput.trim();
    if (!name) return;
    if (form.members.includes(name)) {
      setMemberError("Already added.");
      return;
    }
    if (name.length < 2) {
      setMemberError("Name too short.");
      return;
    }
    setForm(f => ({ ...f, members: [...f.members, name] }));
    setMemberInput("");
    setMemberError("");
  };

  const removeMember = (name) => {
    setForm(f => ({ ...f, members: f.members.filter(m => m !== name) }));
  };

  const handleMemberKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addMember(); }
  };

  // ── Media helpers ───────────────────────────────────────────
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const allowed = files.filter(f =>
      f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    const previews = allowed.map(f => ({
      name: f.name,
      type: f.type.startsWith("video/") ? "video" : "image",
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
      size: (f.size / 1024 / 1024).toFixed(1) + " MB",
    }));
    setForm(f => ({ ...f, mediaFiles: [...f.mediaFiles, ...previews] }));
    e.target.value = "";
  };

  const removeMedia = (idx) => {
    setForm(f => ({ ...f, mediaFiles: f.mediaFiles.filter((_, i) => i !== idx) }));
  };

  // ── Validation ──────────────────────────────────────────────
  const githubValid = isValidGithubUrl(form.github);
  const demoValid   = isValidUrl(form.demo);   // null = empty (ok), false = bad

  const canProceed = () => {
    if (step === 0) return form.title.trim() && form.description.trim() && form.category;
    if (step === 1) return form.tech.length > 0;
    if (step === 2) return githubValid && demoValid !== false;
    return true;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Accent */}
        <div className={styles.accent} />

        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.headerMeta}>
              <span className={styles.headerStep}>STEP {step + 1} / {STEPS.length}</span>
              <span className={styles.headerLabel}>{STEPS[step]}</span>
            </div>
            <h2 className={styles.headerTitle}>UPLOAD PROJECT</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className={styles.progress}>
          <div className={styles.progressBar} style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        {/* Steps */}
        <div className={styles.body}>

          {/* Step 0: Details */}
          {step === 0 && (
            <div className={styles.stepContent}>
              <label className={styles.label}>PROJECT TITLE *</label>
              <input
                className={styles.input}
                placeholder="e.g. NeuralVault"
                value={form.title}
                onChange={e => update("title", e.target.value)}
              />

              <label className={styles.label}>DESCRIPTION *</label>
              <textarea
                className={styles.textarea}
                placeholder="Describe your project in a few sentences..."
                value={form.description}
                onChange={e => update("description", e.target.value)}
                rows={4}
              />

              <label className={styles.label}>CATEGORY *</label>
              <div className={styles.chipGroup}>
                {["WEB", "MOBILE", "AI/ML", "DEVOPS", "DESIGN", "OPEN SOURCE"].map(c => (
                  <button
                    key={c}
                    className={`${styles.chip} ${form.category === c ? styles.chipActive : ""}`}
                    onClick={() => update("category", c)}
                    type="button"
                  >
                    {c}
                  </button>
                ))}
              </div>

              <label className={styles.label}>STATUS</label>
              <div className={styles.chipGroup}>
                {["Ongoing", "Completed"].map(s => (
                  <button
                    key={s}
                    className={`${styles.chip} ${form.status === s ? styles.chipActive : ""}`}
                    onClick={() => update("status", s)}
                    type="button"
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Tech */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <label className={styles.label}>SELECT TECH STACK *</label>
              <p className={styles.hint}>Choose all that apply to your project.</p>
              <div className={styles.techGrid}>
                {TECH_OPTIONS.map(t => (
                  <button
                    key={t}
                    className={`${styles.techChip} ${form.tech.includes(t) ? styles.techChipActive : ""}`}
                    onClick={() => toggleTech(t)}
                    type="button"
                  >
                    {form.tech.includes(t) && <span className={styles.checkmark}>✓</span>}
                    {t}
                  </button>
                ))}
              </div>
              {form.tech.length > 0 && (
                <p className={styles.selected}>{form.tech.length} selected: {form.tech.join(", ")}</p>
              )}
            </div>
          )}

          {/* Step 2: Links, Members, Media */}
          {step === 2 && (
            <div className={styles.stepContent}>

              {/* GitHub URL */}
              <label className={styles.label}>GITHUB / REPOSITORY URL *</label>
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${
                    urlTouched.github
                      ? githubValid ? styles.inputValid : styles.inputError
                      : ""
                  }`}
                  placeholder="https://github.com/username/repo"
                  value={form.github}
                  onChange={e => update("github", e.target.value)}
                  onBlur={() => setUrlTouched(t => ({ ...t, github: true }))}
                  type="url"
                  spellCheck={false}
                />
                {urlTouched.github && (
                  <span className={`${styles.urlIcon} ${githubValid ? styles.urlOk : styles.urlBad}`}>
                    {githubValid ? "✓" : "✕"}
                  </span>
                )}
              </div>
              {urlTouched.github && !githubValid && (
                <p className={styles.errorMsg}>
                  Must be a valid GitHub, GitLab, or Bitbucket URL (e.g. https://github.com/user/repo)
                </p>
              )}

              {/* Demo URL */}
              <label className={styles.label}>LIVE DEMO URL <span className={styles.optionalTag}>OPTIONAL</span></label>
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${
                    urlTouched.demo && form.demo.trim()
                      ? demoValid ? styles.inputValid : styles.inputError
                      : ""
                  }`}
                  placeholder="https://your-demo.vercel.app"
                  value={form.demo}
                  onChange={e => update("demo", e.target.value)}
                  onBlur={() => setUrlTouched(t => ({ ...t, demo: true }))}
                  type="url"
                  spellCheck={false}
                />
                {urlTouched.demo && form.demo.trim() && (
                  <span className={`${styles.urlIcon} ${demoValid ? styles.urlOk : styles.urlBad}`}>
                    {demoValid ? "✓" : "✕"}
                  </span>
                )}
              </div>
              {urlTouched.demo && demoValid === false && (
                <p className={styles.errorMsg}>
                  Must be a valid URL starting with https://
                </p>
              )}

              {/* Team Members */}
              <label className={styles.label}>TEAM MEMBERS <span className={styles.optionalTag}>OPTIONAL</span></label>
              <div className={styles.memberInputRow}>
                <input
                  className={`${styles.input} ${styles.memberInput}`}
                  placeholder="Type a name and press + or Enter"
                  value={memberInput}
                  onChange={e => { setMemberInput(e.target.value); setMemberError(""); }}
                  onKeyDown={handleMemberKey}
                  maxLength={40}
                />
                <button
                  className={styles.addMemberBtn}
                  onClick={addMember}
                  type="button"
                  title="Add member"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
              {memberError && <p className={styles.errorMsg}>{memberError}</p>}
              {form.members.length > 0 && (
                <div className={styles.memberPills}>
                  {form.members.map((m, i) => (
                    <div key={m} className={styles.memberPill}>
                      <span
                        className={styles.memberPillAvatar}
                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                      >
                        {getInitials(m)}
                      </span>
                      <span className={styles.memberPillName}>{m}</span>
                      <button
                        className={styles.memberPillRemove}
                        onClick={() => removeMember(m)}
                        title="Remove"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Media Upload */}
              <label className={styles.label}>PROJECT MEDIA <span className={styles.optionalTag}>IMAGES / VIDEO</span></label>
              <p className={styles.hint}>Upload screenshots, demo images, or a short video clip.</p>
              <button
                className={styles.mediaUploadBtn}
                onClick={() => mediaInputRef.current?.click()}
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <span>CLICK TO UPLOAD</span>
                <span className={styles.mediaHint}>PNG, JPG, GIF, MP4, MOV</span>
              </button>
              <input
                ref={mediaInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className={styles.hiddenInput}
                onChange={handleMediaChange}
              />
              {form.mediaFiles.length > 0 && (
                <div className={styles.mediaGrid}>
                  {form.mediaFiles.map((f, i) => (
                    <div key={i} className={styles.mediaThumb}>
                      {f.type === "image" && f.preview ? (
                        <img src={f.preview} alt={f.name} className={styles.mediaImg} />
                      ) : (
                        <div className={styles.mediaVideoPlaceholder}>
                          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                          </svg>
                        </div>
                      )}
                      <div className={styles.mediaThumbOverlay}>
                        <span className={styles.mediaFileName}>{f.name.length > 14 ? f.name.slice(0,12)+"…" : f.name}</span>
                        <span className={styles.mediaFileSize}>{f.size}</span>
                        <button
                          className={styles.mediaRemoveBtn}
                          onClick={() => removeMedia(i)}
                          title="Remove"
                        >✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <div className={styles.reviewCard}>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>TITLE</span>
                  <span className={styles.reviewVal}>{form.title || "—"}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>CATEGORY</span>
                  <span className={styles.reviewVal}>{form.category || "—"}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>STATUS</span>
                  <span className={styles.reviewVal}>{form.status}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>TECH</span>
                  <span className={styles.reviewVal}>{form.tech.join(", ") || "—"}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>GITHUB</span>
                  <span className={styles.reviewVal}>{form.github || "—"}</span>
                </div>
                {form.demo && (
                  <div className={styles.reviewRow}>
                    <span className={styles.reviewKey}>DEMO</span>
                    <span className={styles.reviewVal}>{form.demo}</span>
                  </div>
                )}
                {form.members.length > 0 && (
                  <div className={styles.reviewRow}>
                    <span className={styles.reviewKey}>TEAM</span>
                    <span className={styles.reviewVal}>{form.members.join(", ")}</span>
                  </div>
                )}
                {form.mediaFiles.length > 0 && (
                  <div className={styles.reviewRow}>
                    <span className={styles.reviewKey}>MEDIA</span>
                    <span className={styles.reviewVal}>{form.mediaFiles.length} file{form.mediaFiles.length > 1 ? "s" : ""} attached</span>
                  </div>
                )}
              </div>
              <p className={styles.reviewNote}>
                Your project will be submitted for admin approval before appearing on the platform.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {step > 0 ? (
            <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>← BACK</button>
          ) : (
            <button className={styles.backBtn} onClick={onClose}>CANCEL</button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              className={`${styles.nextBtn} ${!canProceed() ? styles.disabled : ""}`}
              onClick={() => canProceed() && setStep(s => s + 1)}
              disabled={!canProceed()}
            >
              NEXT →
            </button>
          ) : (
            <button
              className={styles.submitBtn}
              onClick={() => {
                alert("Project submitted for approval!");
                onClose();
              }}
            >
              SUBMIT PROJECT ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
