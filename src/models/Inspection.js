const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    notes: { type: String, default: "" },
    photos: [{ type: String }],
  },
  { _id: false }
);

const inspectionSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    type: { type: String, enum: ["move-in", "move-out"], required: true },
    date: { type: String, required: true },
    rooms: [roomSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inspection", inspectionSchema);
