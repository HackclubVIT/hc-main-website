import { useEffect, useState, useRef } from "react";
import styles from "./ProjectDetailModal.module.css";

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getInitials(name) {
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || "").join("").slice(0, 2);
}

const AVATAR_COLORS = [
  "hsl(350,50%,30%)", "hsl(210,50%,30%)", "hsl(140,40%,25%)",
  "hsl(40,50%,28%)", "hsl(270,40%,30%)", "hsl(180,40%,25%)",
];

// Seed comments per project so they feel real
const SEED_COMMENTS = {
  p001: [
    { id: "c1", author: "Meera L", text: "The inference endpoint design is really clean. How are you handling model versioning conflicts?", timestamp: Date.now() - 7200000, likes: 4, likedByMe: false },
    { id: "c2", author: "Dev P", text: "Great work on the registry architecture. Would love to see a Redis caching layer added.", timestamp: Date.now() - 3600000, likes: 2, likedByMe: false },
  ],
  p003: [
    { id: "c3", author: "Kiran B", text: "Luminary UI is honestly the best dark-mode component lib I've seen from the club. The accessibility work alone is impressive.", timestamp: Date.now() - 86400000, likes: 7, likedByMe: false },
  ],
};

export default function ProjectDetailModal({ project, liked, onLike, onClose }) {
  const [comments, setComments] = useState(SEED_COMMENTS[project.id] || []);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [authorError, setAuthorError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const commentInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleSubmit = () => {
    let valid = true;
    if (!authorName.trim()) { setAuthorError("Please enter your name."); valid = false; }
    else setAuthorError("");
    if (!commentText.trim()) { setCommentError("Comment can't be empty."); valid = false; }
    else if (commentText.trim().length < 5) { setCommentError("Too short — say a bit more."); valid = false; }
    else setCommentError("");
    if (!valid) return;

    const newComment = {
      id: `c${Date.now()}`,
      author: authorName.trim(),
      text: commentText.trim(),
      timestamp: Date.now(),
      likes: 0,
      likedByMe: false,
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const toggleCommentLike = (id) => {
    setComments(prev => prev.map(c =>
      c.id === id
        ? { ...c, likes: c.likedByMe ? c.likes - 1 : c.likes + 1, likedByMe: !c.likedByMe }
        : c
    ));
  };

  const deleteComment = (id) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Close btn */}
        <button className={styles.closeBtn} onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Accent top */}
        <div className={styles.modalAccent} style={{ background: project.accentColor }} />

        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalMeta}>
            <span className={`${styles.statusPill} ${project.status === "Ongoing" ? styles.statusOngoing : styles.statusDone}`}>
              {project.status}
            </span>
            <span className={styles.modalNum}>
              #{project.id.replace("p", "").padStart(3, "0")}
            </span>
          </div>
          <h2 className={styles.modalTitle}>{project.title}</h2>
          <p className={styles.modalDesc}>{project.description}</p>
        </div>

        {/* Tech stack */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>TECH STACK</span>
          <div className={styles.tagGroup}>
            {project.tags.map(t => (
              <span key={t} className={styles.techTag}>{t}</span>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>TEAM</span>
          <div className={styles.teamList}>
            {project.members.map((m, i) => (
              <div key={m.name} className={styles.memberRow}>
                <div className={styles.memberAvatar} style={{ background: `hsl(${i * 60 + 10}, 50%, 30%)` }}>
                  {m.avatar}
                </div>
                <span className={styles.memberName}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{project.likes + (liked ? 1 : 0)}</span>
            <span className={styles.statLabel}>LIKES</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{project.rating}</span>
            <span className={styles.statLabel}>RATING</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{comments.length}</span>
            <span className={styles.statLabel}>COMMENTS</span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actionRow}>
          <button
            className={`${styles.likeBtn} ${liked ? styles.likedBtn : ""}`}
            onClick={onLike}
          >
            <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" width="15" height="15">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {liked ? "LIKED" : "LIKE"}
          </button>

          <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.githubBtn}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            VIEW REPO
          </a>

          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className={styles.demoBtn}>
              LIVE DEMO →
            </a>
          )}
        </div>

        {/* ── Comments ── */}
        <div className={styles.section}>
          <div className={styles.commentHeader}>
            <span className={styles.sectionLabel}>FEEDBACK</span>
            {comments.length > 0 && (
              <span className={styles.commentCount}>{comments.length} comment{comments.length !== 1 ? "s" : ""}</span>
            )}
          </div>

          {/* Input area */}
          <div className={styles.commentForm}>
            {/* Author name */}
            <div className={styles.commentFormRow}>
              <input
                className={`${styles.authorInput} ${authorError ? styles.inputErr : ""}`}
                placeholder="Your name"
                value={authorName}
                onChange={e => { setAuthorName(e.target.value); setAuthorError(""); }}
                maxLength={40}
              />
              {authorError && <span className={styles.fieldError}>{authorError}</span>}
            </div>

            {/* Comment text */}
            <div className={styles.commentInputWrap}>
              <textarea
                ref={commentInputRef}
                className={`${styles.commentTextarea} ${commentError ? styles.inputErr : ""}`}
                placeholder="Share your thoughts, feedback, or suggestions..."
                value={commentText}
                onChange={e => { setCommentText(e.target.value); setCommentError(""); }}
                rows={3}
                maxLength={500}
              />
              <span className={styles.charCount}>{commentText.length}/500</span>
            </div>
            {commentError && <span className={styles.fieldError}>{commentError}</span>}

            {/* Submit row */}
            <div className={styles.submitRow}>
              {submitted && (
                <span className={styles.successMsg}>✓ Comment posted!</span>
              )}
              <button className={styles.submitCommentBtn} onClick={handleSubmit}>
                POST COMMENT
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Comment list */}
          {comments.length === 0 ? (
            <div className={styles.noComments}>
              <span className={styles.noCommentsGlyph}>◌</span>
              <span>No comments yet. Be the first.</span>
            </div>
          ) : (
            <div className={styles.commentList}>
              {comments.map((c, i) => (
                <div key={c.id} className={styles.commentItem} style={{ animationDelay: `${i * 0.05}s` }}>
                  {/* Avatar */}
                  <div
                    className={styles.commentAvatar}
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {getInitials(c.author)}
                  </div>

                  {/* Body */}
                  <div className={styles.commentBody}>
                    <div className={styles.commentTop}>
                      <span className={styles.commentAuthor}>{c.author}</span>
                      <span className={styles.commentTime}>{timeAgo(c.timestamp)}</span>
                    </div>
                    <p className={styles.commentText}>{c.text}</p>
                    <div className={styles.commentActions}>
                      <button
                        className={`${styles.commentLikeBtn} ${c.likedByMe ? styles.commentLiked : ""}`}
                        onClick={() => toggleCommentLike(c.id)}
                      >
                        <svg viewBox="0 0 24 24" fill={c.likedByMe ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" width="11" height="11">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>
                        {c.likes > 0 && <span>{c.likes}</span>}
                      </button>
                      <button
                        className={styles.commentDeleteBtn}
                        onClick={() => deleteComment(c.id)}
                        title="Delete comment"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
/* 
Seed data — NeuralVault and Luminary UI have pre-filled comments so it doesn't look empty during development.
Connecting to backend later — when your team's API is ready, you replace the
 useState([]) initial value with a useEffect fetch 
 to GET /api/projects/:id/comments, and the handleSubmit function with 
 a POST to the same endpoint. The UI doesn't need to change at all.
*/