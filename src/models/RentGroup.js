const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    moveInDay: { type: Number, default: 1 },
  },
  { _id: false }
);

const utilitySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, default: 0 },
  },
  { _id: false }
);

const rentGroupSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    name: { type: String, required: true },
    totalRent: { type: Number, default: 0 },
    members: [memberSchema],
    utilities: [utilitySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("RentGroup", rentGroupSchema);
