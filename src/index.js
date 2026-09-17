require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const authRoutes = require("./routes/auth");
const propertyRoutes = require("./routes/properties");
const inspectionRoutes = require("./routes/inspections");
const maintenanceRoutes = require("./routes/maintenance");
const rentGroupRoutes = require("./routes/rentGroups");
const leaseRoutes = require("./routes/leases");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/properties", propertyRoutes);
app.use("/inspections", inspectionRoutes);
app.use("/maintenance", maintenanceRoutes);
app.use("/rent-groups", rentGroupRoutes);
app.use("/leases", leaseRoutes);
app.use("/upload", uploadRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found." }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong." });
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Keyhold API listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
