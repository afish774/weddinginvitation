import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ─── Shared Gold Rule Divider ───────────────────────────────────────────────
function GoldRule({ width = 120 }) {
  return (
    <svg width={width} height="8" viewBox="0 0 120 8" fill="none" className="mx-auto">
      <line x1="0" y1="4" x2="45" y2="4" stroke="#C5A06C" strokeWidth="0.5" />
      <line x1="75" y1="4" x2="120" y2="4" stroke="#C5A06C" strokeWidth="0.5" />
      <circle cx="60" cy="4" r="1.5" fill="#C5A06C" />
      <path d="M52 4 Q 56 0 60 4 Q 64 0 68 4" stroke="#C5A06C" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

// ─── Family Counter (high-end RSVP insert style) ────────────────────────────
function FamilyCounter({ count, onChange }) {
  return (
    <div className="flex items-center justify-center gap-8 my-8">
      <button
        onClick={() => onChange(Math.max(1, count - 1))}
        disabled={count <= 1}
        className="w-10 h-10 flex items-center justify-center transition-all font-body"
        style={{
          border: "1px solid rgba(197,160,108,0.4)",
          color: count <= 1 ? "rgba(197,160,108,0.3)" : "#C5A06C",
          backgroundColor: "transparent",
          cursor: count <= 1 ? "not-allowed" : "pointer",
          fontSize: "1.2rem",
          fontWeight: 300,
        }}
      >
        −
      </button>

      <div className="text-center">
        <motion.p
          key={count}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display"
          style={{ fontSize: "clamp(3rem, 8vw, 4rem)", color: "#1A1A1A", lineHeight: 1 }}
        >
          {count}
        </motion.p>
        <p className="font-body uppercase tracking-[0.3em] mt-2"
          style={{ fontSize: "8px", color: "#666" }}>
          {count === 1 ? "Person" : "Persons"}
        </p>
      </div>

      <button
        onClick={() => onChange(Math.min(20, count + 1))}
        className="w-10 h-10 flex items-center justify-center transition-all font-body"
        style={{
          backgroundColor: "#2A3A2E",
          color: "#FDFBF7",
          border: "none",
          cursor: "pointer",
          fontSize: "1.2rem",
          fontWeight: 300,
        }}
      >
        +
      </button>
    </div>
  );
}

// ─── Celebration Overlay (elegant, no confetti) ─────────────────────────────
function CelebrationOverlay({ guestName, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(26,26,26,0.65)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative max-w-sm w-full px-8 py-10 text-center"
        style={{
          backgroundColor: "#FDFBF7",
          border: "1px solid rgba(197,160,108,0.3)",
        }}
      >
        {/* Top gold accent line */}
        <div className="absolute top-0 left-6 right-6 h-[1px]" style={{ backgroundColor: "#C5A06C" }} />

        <p className="font-script mb-3" style={{ fontSize: "clamp(2rem, 5vw, 2.6rem)", color: "#C5A06C" }}>
          Wonderful
        </p>

        <GoldRule width={100} />

        <p className="font-display uppercase tracking-[0.25em] mt-4 mb-2"
          style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: "#1A1A1A" }}>
          {guestName ? `${guestName}, we're so happy you're coming` : "We're so happy you're coming"}
        </p>

        <p className="font-body mt-3 mb-8"
          style={{ fontSize: "clamp(8px, 1vw, 9px)", color: "#666", letterSpacing: "0.15em", lineHeight: 1.8 }}>
          Please let us know how many family<br />members will be joining you.
        </p>

        <button
          onClick={onDone}
          className="w-full py-3 transition-all font-body uppercase tracking-[0.2em]"
          style={{
            backgroundColor: "#2A3A2E",
            color: "#FDFBF7",
            border: "none",
            fontSize: "8px",
            fontWeight: 500,
            cursor: "pointer",
            letterSpacing: "0.2em",
          }}
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Thank You Final Screen ─────────────────────────────────────────────────
function ThankYouScreen({ guestName, familyCount }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-[100dvh] w-full flex items-center justify-center p-6 overflow-x-hidden"
      style={{ backgroundColor: "#FDFBF7" }}
    >
      <div className="max-w-sm w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-script mb-3" style={{ fontSize: "clamp(2.5rem, 6vw, 3.2rem)", color: "#C5A06C" }}>
            Thank You
          </p>

          <GoldRule />

          {/* Confirmation Card Insert */}
          <div className="mt-6 mb-8 px-6 py-8"
            style={{ border: "1px solid rgba(197,160,108,0.3)", backgroundColor: "rgba(253,251,247,1)" }}>

            {guestName && (
              <p className="font-script mb-3" style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", color: "#1A1A1A" }}>
                {guestName}
              </p>
            )}

            <p className="font-body uppercase tracking-[0.2em] mb-4"
              style={{ fontSize: "8px", color: "#666" }}>
              Your attendance has been confirmed
            </p>

            <div className="my-4">
              <GoldRule width={80} />
            </div>

            <p className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 3rem)", color: "#1A1A1A", lineHeight: 1 }}>
              {familyCount}
            </p>
            <p className="font-body uppercase tracking-[0.3em] mt-2"
              style={{ fontSize: "8px", color: "#666" }}>
              {familyCount === 1 ? "Guest Confirmed" : "Guests Confirmed"}
            </p>
          </div>

          <p className="font-body uppercase tracking-[0.2em]"
            style={{ fontSize: "7px", color: "#999" }}>
            We can't wait to celebrate with you
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main RSVP Confirmation Page ────────────────────────────────────────────
export default function RsvpConfirmation() {
  const { guestId } = useParams();
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [step, setStep] = useState("celebration"); // "celebration" | "counter" | "thankyou"
  const [familyCount, setFamilyCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/guests/${guestId}`);
        if (!res.ok) throw new Error("Not found");
        setGuest(await res.json());
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [guestId]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/guests/${guestId}/rsvp`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "attending", familyCount }),
      });
      if (!res.ok) throw new Error("Server error");
      setStep("thankyou");
    } catch (e) {
      console.error(e);
      alert("Failed to confirm attendance. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [guestId, familyCount]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center overflow-x-hidden"
        style={{ backgroundColor: "#FDFBF7" }}>
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="font-display uppercase tracking-[0.3em]"
          style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: "#C5A06C" }}
        >
          Preparing Your Response
        </motion.p>
      </div>
    );
  }

  /* ── Error (invalid guestId) ── */
  if (error) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 overflow-x-hidden"
        style={{ backgroundColor: "#FDFBF7" }}>
        <div className="text-center">
          <p className="font-script mb-3" style={{ fontSize: "clamp(2rem, 5vw, 2.6rem)", color: "#C5A06C" }}>
            Invalid Link
          </p>
          <p className="font-body uppercase tracking-[0.2em]"
            style={{ fontSize: "clamp(7px, 1vw, 9px)", color: "#666", letterSpacing: "0.15em" }}>
            This RSVP link is not valid. Please contact the family.
          </p>
        </div>
      </div>
    );
  }

  /* ── Thank You ── */
  if (step === "thankyou") {
    return <ThankYouScreen guestName={guest?.name} familyCount={familyCount} />;
  }

  /* ── Counter + Celebration ── */
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 relative overflow-x-hidden"
      style={{ backgroundColor: "#FDFBF7" }}>

      {/* Celebration overlay */}
      <AnimatePresence>
        {step === "celebration" && (
          <CelebrationOverlay
            guestName={guest?.name}
            onDone={() => setStep("counter")}
          />
        )}
      </AnimatePresence>

      {/* Family counter card */}
      <AnimatePresence>
        {step === "counter" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-sm"
          >
            <div className="px-8 py-10"
              style={{ backgroundColor: "#FDFBF7", border: "1px solid rgba(197,160,108,0.3)" }}>

              {/* Top gold accent */}
              <div className="w-full h-[1px] mb-8" style={{ backgroundColor: "rgba(197,160,108,0.5)" }} />

              <div className="text-center mb-2">
                <p className="font-script mb-3" style={{ fontSize: "clamp(1.6rem, 4vw, 2rem)", color: "#C5A06C" }}>
                  One Last Step
                </p>
                <GoldRule width={80} />
                <p className="font-display uppercase tracking-[0.25em] mt-4 mb-1"
                  style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: "#1A1A1A" }}>
                  How many will attend?
                </p>
                <p className="font-body uppercase tracking-[0.2em] mt-1"
                  style={{ fontSize: "7px", color: "#999" }}>
                  Including yourself
                </p>
              </div>

              <FamilyCounter count={familyCount} onChange={setFamilyCount} />

              {/* Person count visual (thin lines, no emojis) */}
              <div className="flex justify-center gap-1.5 mb-8 flex-wrap">
                {Array.from({ length: Math.min(familyCount, 12) }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="w-2 h-2"
                    style={{ backgroundColor: "#C5A06C", borderRadius: "50%" }}
                  />
                ))}
                {familyCount > 12 && (
                  <span className="font-body" style={{ fontSize: "8px", color: "#999", letterSpacing: "0.1em" }}>
                    +{familyCount - 12}
                  </span>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3 transition-all font-body uppercase tracking-[0.2em]"
                style={{
                  backgroundColor: submitting ? "rgba(42,58,46,0.4)" : "#2A3A2E",
                  color: "#FDFBF7",
                  border: "none",
                  fontSize: "8px",
                  fontWeight: 500,
                  cursor: submitting ? "not-allowed" : "pointer",
                  letterSpacing: "0.2em",
                }}
              >
                {submitting ? "Confirming..." : "Confirm Attendance"}
              </button>
            </div>

            <p className="text-center mt-5 font-body uppercase tracking-[0.2em]"
              style={{ fontSize: "7px", color: "#999" }}>
              We're counting down to see you
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}