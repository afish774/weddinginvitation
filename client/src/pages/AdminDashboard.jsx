import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Shared Gold Rule Divider ───────────────────────────────────────────────
function GoldRule({ width = 120 }) {
  return (
    <svg width={width} height="8" viewBox="0 0 120 8" fill="none" className="mx-auto">
      <line x1="0" y1="4" x2="45" y2="4" stroke="#C5A06C" strokeWidth="0.5" />
      <line x1="75" y1="4" x2="120" y2="4" stroke="#C5A06C" strokeWidth="0.5" />
      <circle cx="60" cy="4" r="1.5" fill="#C5A06C" />
    </svg>
  );
}

// ─── Status Badge (no emojis, clean text) ───────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    pending: { label: "Pending", bg: "rgba(197,160,108,0.1)", color: "#C5A06C", border: "rgba(197,160,108,0.25)" },
    viewed: { label: "Viewed", bg: "rgba(102,102,102,0.08)", color: "#666", border: "rgba(102,102,102,0.2)" },
    attending: { label: "Attending", bg: "rgba(42,58,46,0.1)", color: "#2A3A2E", border: "rgba(42,58,46,0.25)" },
    declined: { label: "Declined", bg: "rgba(180,80,60,0.08)", color: "#9A4A3A", border: "rgba(180,80,60,0.2)" },
  };
  const { label, bg, color, border } = config[status] || config.pending;
  return (
    <span
      className="inline-block px-2.5 py-1 font-body uppercase tracking-[0.15em]"
      style={{ fontSize: "7px", fontWeight: 500, backgroundColor: bg, color, border: `1px solid ${border}` }}
    >
      {label}
    </span>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-5 py-5"
      style={{ backgroundColor: "#FDFBF7", border: "1px solid rgba(197,160,108,0.25)" }}
    >
      <p className="font-body uppercase tracking-[0.3em] mb-2"
        style={{ fontSize: "7px", color: "#999", fontWeight: 400 }}>
        {label}
      </p>
      <p className="font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: "#1A1A1A", lineHeight: 1 }}>
        {value ?? "—"}
      </p>
      {sub && (
        <p className="font-body mt-2" style={{ fontSize: "8px", color: "#999", letterSpacing: "0.1em" }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}

// ─── Password Gate ──────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const ADMIN_PW = "wedding2025";

  const handle = () => {
    if (pw === ADMIN_PW) onUnlock();
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 overflow-x-hidden"
      style={{ backgroundColor: "#1A1A1A" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xs text-center"
      >
        <p className="font-script mb-3" style={{ fontSize: "clamp(2rem, 5vw, 2.6rem)", color: "#C5A06C" }}>
          Admin Access
        </p>
        <p className="font-body uppercase tracking-[0.3em] mb-8"
          style={{ fontSize: "8px", color: "#666" }}>
          Wedding Control Panel
        </p>

        <motion.input
          animate={err ? { x: [-6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handle()}
          placeholder="Enter password"
          className="w-full px-4 py-3 mb-3 outline-none text-center font-body"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: err ? "1px solid #9A4A3A" : "1px solid rgba(197,160,108,0.25)",
            color: "#FDFBF7",
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
          }}
        />
        {err && (
          <p className="font-body mb-2" style={{ fontSize: "9px", color: "#9A4A3A" }}>
            Incorrect password
          </p>
        )}

        <button
          onClick={handle}
          className="w-full py-3 font-body uppercase tracking-[0.2em] transition-all"
          style={{
            backgroundColor: "#C5A06C",
            color: "#1A1A1A",
            border: "none",
            fontSize: "8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Unlock Dashboard
        </button>

      </motion.div>
    </div>
  );
}

// ─── Main Admin Dashboard ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const [unlocked, setUnlocked] = useState(false);
  const [guests, setGuests] = useState([]);
  const [stats, setStats] = useState(null);
  const [newName, setNewName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingGuests, setLoadingGuests] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [gRes, sRes] = await Promise.all([
        fetch("/api/guests"),
        fetch("/api/guests/stats/summary"),
      ]);
      setGuests(await gRes.json());
      setStats(await sRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGuests(false);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    fetchData();
    const id = setInterval(fetchData, 15000);
    return () => clearInterval(id);
  }, [unlocked, fetchData]);

  const handleGenerate = async () => {
    if (!newName.trim()) return;
    setGenerating(true);
    setGeneratedLink(null);
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const guest = await res.json();
      const link = `${window.location.origin}/invite/${guest.uniqueId}`;
      setGeneratedLink({ link, name: newName.trim(), id: guest.uniqueId });
      setNewName("");
      fetchData();
    } catch {
      alert("Failed to generate link. Is the server running?");
    }
    setGenerating(false);
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleDelete = async (uniqueId) => {
    if (!confirm("Delete this guest?")) return;
    try {
      const res = await fetch(`/api/guests/${uniqueId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchData();
    } catch {
      alert("Failed to delete guest. Please try again.");
    }
  };

  const filtered = guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || g.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  // ─── Input / Button shared styles ──────────────────────────────────────
  const inputStyle = {
    backgroundColor: "rgba(26,26,26,0.03)",
    border: "1px solid rgba(197,160,108,0.25)",
    color: "#1A1A1A",
    fontFamily: '"Montserrat", sans-serif',
    fontSize: "0.8rem",
    letterSpacing: "0.05em",
  };

  return (
    <div className="min-h-[100dvh] overflow-x-hidden" style={{ backgroundColor: "#FDFBF7" }}>

      {/* ── Header ── */}
      <div className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: "#1A1A1A", borderBottom: "1px solid rgba(197,160,108,0.2)" }}>
        <div>
          <h1 className="font-display uppercase tracking-[0.15em]"
            style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.95rem)", color: "#FDFBF7" }}>
            Admin Dashboard
          </h1>
          <p className="font-body uppercase tracking-[0.25em] mt-0.5"
            style={{ fontSize: "7px", color: "#666" }}>
            Wedding Concierge
          </p>
        </div>
        <button
          onClick={fetchData}
          className="font-body uppercase tracking-[0.15em] px-3 py-2 transition-all"
          style={{
            color: "#C5A06C",
            border: "1px solid rgba(197,160,108,0.25)",
            backgroundColor: "transparent",
            fontSize: "7px",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* ── Stats Row ── */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total Invited" value={stats.total} />
            <StatCard
              label="Attending"
              value={stats.attending}
              sub={`+ ${stats.totalFamilyMembers} family = ${stats.totalAttending} total`}
            />
            <StatCard label="Declined" value={stats.declined} />
            <StatCard
              label="No Response"
              value={stats.pending + stats.viewed}
              sub={`${stats.pending} pending / ${stats.viewed} viewed`}
            />
          </div>
        )}

        {/* ── Link Generator ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6"
          style={{ backgroundColor: "#FDFBF7", border: "1px solid rgba(197,160,108,0.25)" }}
        >
          <h2 className="font-display uppercase tracking-[0.2em] mb-5"
            style={{ fontSize: "clamp(10px, 1.3vw, 12px)", color: "#1A1A1A" }}>
            Generate Personalized Link
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder='e.g. "Uncle John & Family"'
              className="flex-1 px-4 py-3 outline-none font-body"
              style={inputStyle}
            />
            <button
              onClick={handleGenerate}
              disabled={generating || !newName.trim()}
              className="px-5 py-3 font-body uppercase tracking-[0.15em] transition-all whitespace-nowrap"
              style={{
                backgroundColor: generating || !newName.trim() ? "rgba(42,58,46,0.3)" : "#2A3A2E",
                color: "#FDFBF7",
                border: "none",
                fontSize: "8px",
                fontWeight: 500,
                cursor: generating || !newName.trim() ? "not-allowed" : "pointer",
              }}
            >
              {generating ? "Generating..." : "Generate Link"}
            </button>
          </div>

          {/* Generated link display */}
          <AnimatePresence>
            {generatedLink && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 overflow-hidden"
                style={{ backgroundColor: "rgba(197,160,108,0.06)", border: "1px solid rgba(197,160,108,0.2)" }}
              >
                <p className="font-body mb-2" style={{ fontSize: "9px", color: "#1A1A1A", fontWeight: 500 }}>
                  Link generated for{" "}
                  <span style={{ color: "#C5A06C" }}>{generatedLink.name}</span>
                </p>
                <div className="flex items-center gap-2">
                  <code
                    className="flex-1 py-2 px-3 break-all"
                    style={{
                      backgroundColor: "rgba(26,26,26,0.03)",
                      color: "#1A1A1A",
                      fontFamily: "monospace",
                      fontSize: "0.7rem",
                    }}
                  >
                    {generatedLink.link}
                  </code>
                  <button
                    onClick={() => handleCopy(generatedLink.link)}
                    className="flex-shrink-0 px-4 py-2 font-body uppercase tracking-[0.1em] transition-all"
                    style={{
                      backgroundColor: copiedLink === generatedLink.link ? "#2A3A2E" : "#C5A06C",
                      color: copiedLink === generatedLink.link ? "#FDFBF7" : "#1A1A1A",
                      border: "none",
                      fontSize: "7px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {copiedLink === generatedLink.link ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="font-body mt-2" style={{ fontSize: "8px", color: "#999", letterSpacing: "0.1em" }}>
                  Share via WhatsApp, SMS, or Email
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Guest Table ── */}
        <div style={{ backgroundColor: "#FDFBF7", border: "1px solid rgba(197,160,108,0.25)" }}>

          {/* Table header controls */}
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ borderBottom: "1px solid rgba(197,160,108,0.15)" }}>
            <h2 className="font-display uppercase tracking-[0.2em] flex-1"
              style={{ fontSize: "clamp(10px, 1.3vw, 12px)", color: "#1A1A1A" }}>
              Guest List
              <span className="font-body ml-2" style={{ color: "#999", fontWeight: 300, fontSize: "10px" }}>
                ({filtered.length} of {guests.length})
              </span>
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name..."
                className="px-3 py-1.5 text-sm outline-none font-body"
                style={{ ...inputStyle, width: "140px", fontSize: "0.75rem" }}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 text-sm outline-none font-body"
                style={{ ...inputStyle, fontSize: "0.75rem" }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="viewed">Viewed</option>
                <option value="attending">Attending</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>

          {/* Table content */}
          <div className="overflow-x-auto">
            {loadingGuests ? (
              <div className="flex items-center justify-center py-16">
                <motion.p
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="font-body uppercase tracking-[0.3em]"
                  style={{ fontSize: "8px", color: "#C5A06C" }}
                >
                  Loading Guests
                </motion.p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-script mb-2" style={{ fontSize: "1.5rem", color: "#C5A06C" }}>
                  No Guests Yet
                </p>
                <p className="font-body uppercase tracking-[0.2em]"
                  style={{ fontSize: "8px", color: "#999" }}>
                  Generate your first link above
                </p>
              </div>
            ) : (
              <table className="w-full" style={{ minWidth: "640px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(197,160,108,0.12)" }}>
                    {["Guest Name", "Status", "Family", "Invite Link", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 font-body uppercase tracking-[0.2em]"
                        style={{ fontSize: "7px", color: "#999", fontWeight: 500 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((guest, i) => {
                      const link = `${window.location.origin}/invite/${guest.uniqueId}`;
                      return (
                        <motion.tr
                          key={guest.uniqueId}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.4 }}
                          className="transition-colors"
                          style={{ borderBottom: "1px solid rgba(197,160,108,0.08)" }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(197,160,108,0.04)"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <td className="px-5 py-3.5">
                            <p className="font-display" style={{ color: "#1A1A1A", fontSize: "0.85rem" }}>
                              {guest.name}
                            </p>
                            <p className="font-body mt-0.5"
                              style={{ color: "#999", fontSize: "0.6rem", letterSpacing: "0.05em" }}>
                              {new Date(guest.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                            </p>
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={guest.status} />
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-display"
                              style={{
                                fontSize: "1.1rem",
                                color: guest.status === "attending" ? "#2A3A2E" : "#999",
                              }}>
                              {guest.status === "attending" ? guest.familyCount || 1 : "—"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <code className="font-body" style={{
                                color: "#999",
                                fontFamily: "monospace",
                                fontSize: "0.6rem",
                                maxWidth: "160px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "block",
                              }}>
                                /invite/{guest.uniqueId}
                              </code>
                              <button
                                onClick={() => handleCopy(link)}
                                className="font-body uppercase tracking-[0.1em] px-2 py-1 transition-all"
                                style={{
                                  backgroundColor: "rgba(197,160,108,0.1)",
                                  color: "#C5A06C",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "6px",
                                  fontWeight: 500,
                                }}
                              >
                                Copy
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => handleDelete(guest.uniqueId)}
                              className="font-body uppercase tracking-[0.1em] px-2.5 py-1 transition-all"
                              style={{
                                backgroundColor: "rgba(154,74,58,0.06)",
                                color: "#9A4A3A",
                                border: "1px solid rgba(154,74,58,0.15)",
                                cursor: "pointer",
                                fontSize: "6px",
                                fontWeight: 500,
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center font-body uppercase tracking-[0.2em] py-4"
          style={{ fontSize: "7px", color: "#CCC" }}>
          Auto-refreshes every 15 seconds
        </p>
      </div>
    </div>
  );
}