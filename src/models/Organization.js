const mongoose = require("mongoose");
const crypto = require("crypto");

function generateInviteCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase(); // e.g. "A1B2C3D4"
}

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    inviteCode: { type: String, required: true, unique: true, default: generateInviteCode },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", organizationSchema);
