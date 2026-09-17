const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organization = require("../models/Organization");
const requireAuth = require("../middleware/auth");

const router = express.Router();

function issueToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), organizationId: user.organization.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

function publicUser(user, organization) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    organization: {
      id: organization._id,
      name: organization.name,
      inviteCode: organization.inviteCode,
    },
  };
}

// Creates a brand-new organization plus its first user (the "owner").
// This is the signup path for the first person at a company to set up Keyhold.
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;
    if (!name || !email || !password || !companyName) {
      return res.status(400).json({ error: "name, email, password, and companyName are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const organization = await Organization.create({ name: companyName.trim() });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      organization: organization._id,
      role: "owner",
    });

    const token = issueToken(user);
    res.status(201).json({ token, user: publicUser(user, organization) });
  } catch (err) {
    res.status(500).json({ error: "Registration failed." });
  }
});

// Joins an EXISTING organization using its invite code — this is how a
// company scales past one person: the owner shares their invite code with
// staff, and everyone who joins with it sees the same shared data.
router.post("/join", async (req, res) => {
  try {
    const { name, email, password, inviteCode } = req.body;
    if (!name || !email || !password || !inviteCode) {
      return res.status(400).json({ error: "name, email, password, and inviteCode are required." });
    }

    const organization = await Organization.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
    if (!organization) {
      return res.status(404).json({ error: "No organization found for that invite code." });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      organization: organization._id,
      role: "member",
    });

    const token = issueToken(user);
    res.status(201).json({ token, user: publicUser(user, organization) });
  } catch (err) {
    res.status(500).json({ error: "Joining failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).populate("organization");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = issueToken(user);
    res.json({ token, user: publicUser(user, user.organization) });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("organization");
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: publicUser(user, user.organization) });
});

module.exports = router;
