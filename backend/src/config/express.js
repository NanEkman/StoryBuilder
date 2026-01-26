// src/config/express.js
const express = require("express");
const cors = require("cors");

function createExpressApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  // Simple request logger
  app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    if (req.method === "POST" || req.method === "PUT") {
      try {
        console.log("[BODY]", JSON.stringify(req.body).slice(0, 1000));
      } catch (e) {}
    }
    next();
  });
  return app;
}

module.exports = createExpressApp;
