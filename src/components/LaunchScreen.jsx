import { useState, useEffect } from 'react'

export default function LaunchScreen({ onComplete }) {
  const [showSplashPhase, setShowSplashPhase] = useState(0)
  const [splashText, setSplashText] = useState('')

  useEffect(() => {
    const textTimer = window.setTimeout(() => {
      setShowSplashPhase(1)
    }, 800)

    const text = 'HackClub';
    const intervals = [];
    for (let i = 1; i <= text.length; i++) {
        const timer = setTimeout(() => {
            setSplashText(text.substring(0, i));
        }, 800 + (i * 120));
        intervals.push(timer);
    }

    const hideTimer = window.setTimeout(() => {
      if (onComplete) onComplete();
    }, 800 + (text.length * 120) + 600)

    return () => {
      window.clearTimeout(textTimer)
      window.clearTimeout(hideTimer)
      intervals.forEach(clearTimeout)
    }
  }, [onComplete])

  return (
    <div className="launch-screen">
      <div className="launch-card launch-inline">
        {showSplashPhase === 0 ? (
          <div className="launch-logo">
            <span className="launch-main">h</span>
            <span className="launch-dot">.</span>
          </div>
        ) : (
          <div className="launch-typing-word">
            {splashText}
          </div>
        )}
      </div>
    </div>
  )
}
