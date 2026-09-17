const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    vendor: { type: String, default: "" },
    cost: { type: Number, default: 0 },
    status: { type: String, enum: ["open", "in-progress", "done"], default: "open" },
    dateCreated: { type: String, required: true },
    dateResolved: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
