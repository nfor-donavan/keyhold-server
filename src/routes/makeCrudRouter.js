const express = require("express");
const requireAuth = require("../middleware/auth");

// Every record is scoped to the logged-in user's ORGANIZATION, not just
// that one user — this is what lets multiple staff at the same company
// see and share the same properties, inspections, maintenance, etc.
// createdBy is still recorded per-record for an audit trail.
function makeCrudRouter(Model) {
  const router = express.Router();
  router.use(requireAuth);

  router.get("/", async (req, res) => {
    const items = await Model.find({ organization: req.user.organizationId }).sort({ createdAt: -1 });
    res.json(items);
  });

  router.get("/:id", async (req, res) => {
    const item = await Model.findOne({ _id: req.params.id, organization: req.user.organizationId });
    if (!item) return res.status(404).json({ error: "Not found." });
    res.json(item);
  });

  router.post("/", async (req, res) => {
    const { organization, createdBy, _id, ...body } = req.body;
    const item = await Model.create({
      ...body,
      organization: req.user.organizationId,
      createdBy: req.user.id,
    });
    res.status(201).json(item);
  });

  router.put("/:id", async (req, res) => {
    const { organization, createdBy, _id, ...updates } = req.body;
    const item = await Model.findOneAndUpdate(
      { _id: req.params.id, organization: req.user.organizationId },
      updates,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: "Not found." });
    res.json(item);
  });

  router.delete("/:id", async (req, res) => {
    const result = await Model.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.organizationId,
    });
    if (!result) return res.status(404).json({ error: "Not found." });
    res.json({ deleted: true });
  });

  return router;
}

module.exports = makeCrudRouter;
