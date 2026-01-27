require("dotenv").config();
const path = require("path");
const express = require("express");
const hbs = require("hbs");

const journalRoutes = require("./routes/journal.js");
const moodRoutes = require("./routes/mood.js");

const app = express();
const port = process.env.PORT || 8080;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

const app = express();
// Parse incoming JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup handlebars engine and view location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

// Landing Page
app.get("/", (req, res) => {
  res.render("landing-page"); //res -> Render -> landing Page (landing.hbs)
});

// Login
app.get("/login", (req, res) => {
  res.render("login"); //res -> Render -> login Page (login.hbs)
});

// Auth page (login + signup)
app.get("/auth", (req, res) => {
  res.render("auth");
});

// Homepage
app.get("/homepage", (req, res) => {
  res.render("homepage"); //res -> Render -> homepage (homepage.hbs)
});

// Resources
app.get("/resources", (req, res) => {
  res.render("resources"); //res -> Render -> resources Page (resources.hbs)
});

// About Us
app.get("/About", (req, res) => {
  res.render("about"); //res -> Render -> About Us Page (about.hbs)
});

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// routes for Journal and Mood endpoints
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
