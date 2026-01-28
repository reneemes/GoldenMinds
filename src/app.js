require("dotenv").config();
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const cookieParser = require('cookie-parser');
// const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/auth.js");
const journalRoutes = require("./routes/journal.js");
const moodRoutes = require("./routes/mood.js");

const auth = require("./middleware/auth.js");

const port = process.env.PORT || 8080;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

const app = express();
// Parse incoming JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup handlebars engine and view location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

// Landing Page
app.get("/", (req, res) => {
  res.render("landing"); //res -> Render -> landing Page (landing.hbs)
});

// Auth page (login + signup)
app.get("/auth", (req, res) => {
  res.render("auth");
});

// Homepage
app.get("/homepage", auth, (req, res) => {
  res.render("homepage"); //res -> Render -> homepage (homepage.hbs)
});

// Resources
app.get("/resources", auth, (req, res) => {
  res.render("resources"); //res -> Render -> resources Page (resources.hbs)
});

// About Us
app.get("/about", (req, res) => {
  res.render("about"); //res -> Render -> About Us Page (about.hbs)
});

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// routes for Journal, Mood, and Login
app.use("/auth", authRoutes);
app.use('/journal', journalRoutes);
app.use('/mood', moodRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: 'Something went wrong',
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
