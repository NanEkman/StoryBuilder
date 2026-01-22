// src/routes/healthRoutes.js
const express = require("express");
const router = express.Router();

router.get("/health", async (req, res) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res
        .status(500)
        .json({ status: "Error", message: "Supabase not configured" });
    }
    res.json({ status: "OK", supabase: process.env.SUPABASE_URL });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
});

module.exports = router;
