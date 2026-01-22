// src/middleware/verifyToken.js
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Token saknas eller fel format" });
    }
    const token = parts[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Ogiltig eller utgången token" });
      }
      req.userId = decoded.userId;
      req.username = decoded.username;
      next();
    });
  } catch (err) {
    console.error("verifyToken error", err);
    return res.status(500).json({ error: "Autentiseringsfel" });
  }
}

module.exports = verifyToken;
