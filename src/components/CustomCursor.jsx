import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: -100, y: -100 });
  const ring    = useRef({ x: -100, y: -100 });
  const raf     = useRef(null);
  const [clicking, setClicking]   = useState(false);
  const [hovering, setHovering]   = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    // Detect hovering over clickable elements
    const onOver = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, textarea, select, label');
      setHovering(!!el);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("mouseover", onOver);

    // Animation loop — dot snaps, ring lags behind
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }

      if (ringRef.current) {
        ring.current.x += (pos.current.x - ring.current.x) * 1;
        ring.current.y += (pos.current.y - ring.current.y) * 1;
        ringRef.current.style.transform =
          `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Inner dot — snaps instantly */}
      <div
        ref={dotRef}
        className={`${styles.dot} ${clicking ? styles.dotClick : ""} ${hovering ? styles.dotHover : ""}`}
      />
      {/* Outer ring — lags behind */}
      <div
        ref={ringRef}
        className={`${styles.ring} ${clicking ? styles.ringClick : ""} ${hovering ? styles.ringHover : ""}`}
      />
    </>
  );
}
