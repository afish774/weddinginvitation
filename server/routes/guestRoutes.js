const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const Guest = require("../models/Guest");

// GET all guests (admin dashboard)
router.get("/", async (req, res) => {
  try {
    const guests = await Guest.find().sort({ createdAt: -1 });
    res.json(guests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch guests" });
  }
});

// GET stats summary — must be before /:uniqueId to avoid conflict
router.get("/stats/summary", async (req, res) => {
  try {
    const total = await Guest.countDocuments();
    const attending = await Guest.find({ status: "attending" });
    const declined = await Guest.countDocuments({ status: "declined" });
    const viewed = await Guest.countDocuments({ status: "viewed" });
    const pending = await Guest.countDocuments({ status: "pending" });
    // familyCount includes the guest themselves (counter says "Including yourself")
    const totalAttending = attending.reduce(
      (acc, g) => acc + (g.familyCount || 1),
      0
    );

    res.json({
      total,
      attending: attending.length,
      declined,
      viewed,
      pending,
      totalFamilyMembers: totalAttending - attending.length,
      totalAttending,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// GET single guest by uniqueId
router.get("/:uniqueId", async (req, res) => {
  try {
    const guest = await Guest.findOne({ uniqueId: req.params.uniqueId });
    if (!guest) return res.status(404).json({ error: "Guest not found" });

    // Mark as viewed if still pending
    if (guest.status === "pending") {
      guest.status = "viewed";
      guest.viewedAt = new Date();
      await guest.save();
    }

    res.json(guest);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch guest" });
  }
});

// POST create new guest (admin generates link)
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Guest name is required" });
    }

    const uniqueId = nanoid(8);
    const guest = new Guest({ name: name.trim(), uniqueId });
    await guest.save();

    res.status(201).json(guest);
  } catch (err) {
    res.status(500).json({ error: "Failed to create guest" });
  }
});

// PATCH update RSVP status
router.patch("/:uniqueId/rsvp", async (req, res) => {
  try {
    const { status, familyCount } = req.body;
    const guest = await Guest.findOne({ uniqueId: req.params.uniqueId });
    if (!guest) return res.status(404).json({ error: "Guest not found" });

    guest.status = status;
    if (status === "attending" && familyCount !== undefined) {
      guest.familyCount = familyCount;
    }
    guest.respondedAt = new Date();
    await guest.save();

    res.json(guest);
  } catch (err) {
    res.status(500).json({ error: "Failed to update RSVP" });
  }
});

// DELETE guest (admin)
router.delete("/:uniqueId", async (req, res) => {
  try {
    await Guest.findOneAndDelete({ uniqueId: req.params.uniqueId });
    res.json({ message: "Guest deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete guest" });
  }
});

module.exports = router;