const express = require("express");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

app.use(express.json()); // parse JSON bodies

// Routes
app.use("/api/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
