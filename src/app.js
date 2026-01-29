require("dotenv").config();
const path = require("path");
const express = require("express");
const hbs = require("hbs");

const app = express();

const port = process.env.PORT || 8080;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and view location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

// Landing Page5
app.get("", (req, res) => {
  res.render("landing"); //res -> Render -> landing Page (landing.hbs)
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

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
