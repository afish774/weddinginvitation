import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import InvitationCard from "../components/Invitationcard";

// ─── Gold Divider (shared accent) ───────────────────────────────────────────
function GoldRule() {
  return (
    <svg width="120" height="8" viewBox="0 0 120 8" fill="none" className="mx-auto my-6">
      <line x1="0" y1="4" x2="45" y2="4" stroke="#C5A06C" strokeWidth="0.5" />
      <line x1="75" y1="4" x2="120" y2="4" stroke="#C5A06C" strokeWidth="0.5" />
      <circle cx="60" cy="4" r="1.5" fill="#C5A06C" />
      <path d="M52 4 Q 56 0 60 4 Q 64 0 68 4" stroke="#C5A06C" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

// ─── Parchment Page Shell ───────────────────────────────────────────────────
function ParchmentShell({ children }) {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 overflow-x-hidden"
      style={{ backgroundColor: "#FDFBF7" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center max-w-sm w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function SpecificInvite() {
  const { guestId } = useParams();
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    if (!guestId) return;
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

  /* ── Loading State ── */
  if (loading) {
    return (
      <ParchmentShell>
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="font-display uppercase tracking-[0.3em]"
          style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: "#C5A06C" }}
        >
          Retrieving Invitation
        </motion.p>
      </ParchmentShell>
    );
  }

  /* ── Error State ── */
  if (error) {
    return (
      <ParchmentShell>
        <p className="font-script mb-2" style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", color: "#C5A06C" }}>
          We're Sorry
        </p>
        <GoldRule />
        <p className="font-display uppercase tracking-[0.25em] mb-2"
          style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: "#1A1A1A" }}>
          Invitation Not Found
        </p>
        <p className="font-body mt-3"
          style={{ fontSize: "clamp(9px, 1.1vw, 10px)", color: "#666", letterSpacing: "0.15em", lineHeight: 1.8 }}>
          This link may be invalid or expired.<br />Please contact the family for assistance.
        </p>
      </ParchmentShell>
    );
  }

  /* ── Declined State ── */
  if (declined) {
    return (
      <ParchmentShell>
        <p className="font-script mb-2" style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", color: "#C5A06C" }}>
          We'll Miss You
        </p>
        <GoldRule />
        <p className="font-display uppercase tracking-[0.25em]"
          style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: "#1A1A1A" }}>
          {guest?.name}
        </p>
        <p className="font-body mt-3"
          style={{ fontSize: "clamp(9px, 1.1vw, 10px)", color: "#666", letterSpacing: "0.15em", lineHeight: 1.8 }}>
          We understand and appreciate you letting us know.
        </p>
      </ParchmentShell>
    );
  }

  /* ── Main Invitation ── */
  return (
    <InvitationCard
      guestName={guest?.name}
      guestId={guestId}
      onDecline={() => setDeclined(true)}
    />
  );
}