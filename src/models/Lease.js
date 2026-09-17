const mongoose = require("mongoose");

const leaseSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    monthlyRent: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    renewalNoticeDays: { type: Number, default: 30 },
    notes: { type: String, default: "" },
    fileName: { type: String, default: null },
    fileUrl: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lease", leaseSchema);
