const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../db.js");

// SIGN UP
exports.signup = async (req, res) => {
  const { firstName, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection
      .promise()
      .query(
        "INSERT INTO users (first_name, username, password) VALUES (?, ?, ?)",
        [firstName, username, hashedPassword],
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
};

// SIGN IN
exports.signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM users WHERE LOWER(username) = LOWER(?)", [
        username,
      ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    console.log("Stored hash:", user.password);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials - password" });
    }

    const token = jwt.sign(
      { id: user.id, first_name: user.first_name, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
      })
      .status(200)
      .json({
        message: "Sign in successful",
        token,
        user: {
          id: user.id,
          first_name: user.first_name,
          username: user.username,
        },
      });
  } catch (error) {
    res.status(500).json({
      message: "Error signing in",
      error: error.message,
    });
  }
};

// SIGN OUT
exports.signout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth");
};
