const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    uniqueId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "viewed", "attending", "declined"],
      default: "pending",
    },
    familyCount: { type: Number, default: 0 },
    viewedAt: { type: Date },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", GuestSchema);