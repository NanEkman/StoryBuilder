const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const createExpressApp = require("./config/express");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = createExpressApp();
const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/", healthRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Något gick fel på servern" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server körs på http://localhost:${PORT}`);
  console.log(`Databas: ${process.env.DATABASE_URL}`);
});

module.exports = app;
