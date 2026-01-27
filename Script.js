const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const db = require("./src/db.js");

//SignUp for New User
app.post("/signup", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
      [name, username, hashedPassword],
    );

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
});

//Sign In for Existing User (with JWT)
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, username: user.username }, // payload
      "hopehackssecretkey", // secret key
      { expiresIn: "1h" }, // token expires in 1 hour
    );

    res.status(200).json({
      message: "Sign in successful",
      token, // return token to client
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error signing in",
      error: error.message,
    });
  }
});

app.post("/signout", async (req, res) => {
  res.status(200).json({ message: "Signed out successfully" });
});
