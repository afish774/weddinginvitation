import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ─── Corner Ornament SVG (Top-Left style) ────────────────────────────────────
function CornerOrnament({ className = "", style = {} }) {
  return (
    <svg className={className} style={style} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main corner lines */}
      <path d="M2 120 L2 2 L120 2" stroke="#C5A06C" strokeWidth="1" fill="none" />
      {/* Inner curved flourish */}
      <path d="M2 80 C 2 50 15 30 40 20" stroke="#C5A06C" strokeWidth="0.6" fill="none" />
      <path d="M80 2 C 50 2 30 15 20 40" stroke="#C5A06C" strokeWidth="0.6" fill="none" />
      {/* Scroll curl top-left */}
      <path d="M15 50 C 10 40 15 25 30 20 C 38 18 42 22 38 28 C 34 34 25 35 20 30" stroke="#C5A06C" strokeWidth="0.5" fill="none" />
      <path d="M50 15 C 40 10 25 15 20 30 C 18 38 22 42 28 38 C 34 34 35 25 30 20" stroke="#C5A06C" strokeWidth="0.5" fill="none" />
      {/* Small leaf/petal accents */}
      <path d="M25 12 C 30 8 35 10 32 15 C 29 18 24 16 25 12Z" stroke="#C5A06C" strokeWidth="0.4" fill="none" />
      <path d="M12 25 C 8 30 10 35 15 32 C 18 29 16 24 12 25Z" stroke="#C5A06C" strokeWidth="0.4" fill="none" />
    </svg>
  );
}

// ─── Gold Decorative Divider ─────────────────────────────────────────────────
function GoldDivider({ width = 200 }) {
  return (
    <svg width={width} height="16" viewBox="0 0 200 16" fill="none" className="mx-auto">
      <line x1="0" y1="8" x2="70" y2="8" stroke="#C5A06C" strokeWidth="0.5" />
      <line x1="130" y1="8" x2="200" y2="8" stroke="#C5A06C" strokeWidth="0.5" />
      {/* Center ornament - small leaves/branches */}
      <path d="M85 8 C 88 4 92 2 96 4 L 100 8 L 104 4 C 108 2 112 4 115 8" stroke="#C5A06C" strokeWidth="0.5" fill="none" />
      <path d="M90 8 C 93 11 97 13 100 10 C 103 13 107 11 110 8" stroke="#C5A06C" strokeWidth="0.5" fill="none" />
      <circle cx="100" cy="8" r="1.2" fill="#C5A06C" />
      {/* Tiny leaf accents */}
      <path d="M75 7 C 77 5 80 6 78 8" stroke="#C5A06C" strokeWidth="0.4" fill="none" />
      <path d="M125 7 C 123 5 120 6 122 8" stroke="#C5A06C" strokeWidth="0.4" fill="none" />
      <circle cx="72" cy="8" r="0.6" fill="#C5A06C" />
      <circle cx="128" cy="8" r="0.6" fill="#C5A06C" />
    </svg>
  );
}

// ─── Bottom Gold Flourish ────────────────────────────────────────────────────
function BottomFlourish() {
  return (
    <svg width="160" height="30" viewBox="0 0 160 30" fill="none" className="mx-auto">
      {/* Center swirl */}
      <path d="M60 15 C 65 5 75 2 80 10 C 85 2 95 5 100 15" stroke="#C5A06C" strokeWidth="0.6" fill="none" />
      <path d="M65 15 C 70 20 75 22 80 18 C 85 22 90 20 95 15" stroke="#C5A06C" strokeWidth="0.6" fill="none" />
      {/* Extending curls left */}
      <path d="M60 15 C 55 12 45 10 35 13 C 30 15 28 18 32 20 C 36 22 40 18 38 14" stroke="#C5A06C" strokeWidth="0.5" fill="none" />
      <path d="M35 13 C 30 10 22 12 18 16" stroke="#C5A06C" strokeWidth="0.4" fill="none" />
      {/* Extending curls right */}
      <path d="M100 15 C 105 12 115 10 125 13 C 130 15 132 18 128 20 C 124 22 120 18 122 14" stroke="#C5A06C" strokeWidth="0.5" fill="none" />
      <path d="M125 13 C 130 10 138 12 142 16" stroke="#C5A06C" strokeWidth="0.4" fill="none" />
      {/* Center diamond */}
      <path d="M77 12 L 80 8 L 83 12 L 80 16 Z" stroke="#C5A06C" strokeWidth="0.4" fill="none" />
      <circle cx="80" cy="12" r="1" fill="#C5A06C" />
    </svg>
  );
}

// ─── Minimalist Countdown Component ──────────────────────────────────────────
function MinimalCountdown({ weddingDate }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calc = () => {
      const distance = weddingDate.getTime() - new Date().getTime();
      if (distance <= 0) return null;
      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / 1000 / 60) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      };
    };

    setTimeLeft(calc());
    const timer = setInterval(() => {
      const result = calc();
      if (!result) { clearInterval(timer); setTimeLeft(null); return; }
      setTimeLeft(result);
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  // Don't render anything if the wedding date has passed
  if (!timeLeft) return null;

  return (
    <div className="flex justify-center items-center my-6"
      style={{ gap: "clamp(1.2rem, 3vw, 2.5rem)" }}>
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-display leading-none"
            style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)", color: "#1A1A1A" }}>
            {String(value).padStart(2, "0")}
          </span>
          <span className="font-body uppercase mt-2"
            style={{ fontSize: "clamp(6px, 1vw, 9px)", letterSpacing: "0.25em", color: "#666" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Invitation Card ────────────────────────────────────────────────────
export default function InvitationCard({ guestName = null, guestId = null, onDecline = null }) {
  const navigate = useNavigate();

  // Set to match the hardcoded date in your design (April 12, 2025 at 9:00 AM)
  const WEDDING_DATE = new Date("2026-07-11T16:00:00");

  const handleAttend = () => guestId && navigate(`/rsvp/confirm/${guestId}`);
  const handleDecline = async () => {
    if (!guestId) return;
    try {
      const res = await fetch(`/api/guests/${guestId}/rsvp`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "declined" }),
      });
      if (!res.ok) throw new Error("Server error");
      if (onDecline) onDecline();
    } catch (e) {
      console.error(e);
      alert("Failed to send your response. Please try again.");
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] } }
  };

  return (
    <div className="invitation-page">
      {/* ── Floral Images ── */}
      <img
        src="/floral-top-right.png"
        alt=""
        className="floral-corner floral-top-right"
        onError={(e) => e.target.style.display = 'none'}
      />
      <img
        src="/floral-bottom-left.png"
        alt=""
        className="floral-corner floral-bottom-left"
        onError={(e) => e.target.style.display = 'none'}
      />

      {/* ── Gold Border Frame ── */}
      <div className="gold-frame">
        <CornerOrnament className="corner-ornament corner-tl" />
        <CornerOrnament className="corner-ornament corner-tr" style={{ transform: 'scaleX(-1)' }} />
        <CornerOrnament className="corner-ornament corner-bl" style={{ transform: 'scaleY(-1)' }} />
        <CornerOrnament className="corner-ornament corner-br" style={{ transform: 'scale(-1, -1)' }} />
      </div>

      {/* ── Card Content ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
        className="card-content"
      >
        {/* 1. SAVE THE DATE */}
        <motion.p variants={fadeUp} className="save-the-date">
          Save the Date
        </motion.p>

        {/* 2. NAMES */}
        <motion.div variants={fadeUp} className="names-section">
          <div className="name-row name-row-first">
            <h1 className="name-first">Suhail</h1>
            <span className="name-last">NS</span>
          </div>

          <span className="ampersand">&amp;</span>

          <div className="name-row name-row-second">
            <h1 className="name-first">Jasna</h1>
            <span className="name-last">Sharin</span>
          </div>
        </motion.div>

        {/* 3. Gold Divider */}
        <motion.div variants={fadeUp} className="divider-section">
          <GoldDivider width={220} />
        </motion.div>

        {/* 4. Invitation Text */}
        <motion.div variants={fadeUp} className="invitation-text">
          <p className="together-line">Together with families</p>
          <p className="invite-line">
            Invite you to their wedding ceremony and<br />celebration
          </p>
        </motion.div>

        {/* 5. Date Block */}
        <motion.div variants={fadeUp} className="date-block">
          <p className="date-year">2026</p>

          <div className="date-row">
            <div className="date-day-label">
              <span>Saturday</span>
            </div>
            <span className="date-number">11</span>
            <div className="date-day-label">
              <span>July</span>
            </div>
          </div>

          <p className="date-time">At 04 PM</p>
        </motion.div>

        {/* 6. Venue */}
        <motion.p variants={fadeUp} className="venue-text">
          Namas international convention centre, Thozhiyoor
        </motion.p>

        {/* 7. Reception */}
        <motion.p variants={fadeUp} className="reception-text">
          Reception to follow
        </motion.p>

        {/* 8. LIVE COUNTDOWN */}
        <motion.div variants={fadeUp}>
          <MinimalCountdown weddingDate={WEDDING_DATE} />
        </motion.div>

        {/* 9. Bottom Flourish */}
        <motion.div variants={fadeUp} className="bottom-flourish">
          <BottomFlourish />
        </motion.div>

        {/* 10. RSVP Buttons (only when guest has ID) */}
        {guestId && (
          <motion.div variants={fadeUp} className="rsvp-section">
            <p className="rsvp-message">
              {guestName ? `We hope to see you, ${guestName}` : "Please respond to our invitation"}
            </p>
            <div className="rsvp-buttons">
              <button onClick={handleAttend} className="rsvp-btn rsvp-accept">
                Accept
              </button>
              <button onClick={handleDecline} className="rsvp-btn rsvp-decline">
                Decline
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}