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

// Landing Page
app.get("/", (req, res) => {
  res.render("landing"); //res -> Render -> landing Page (landing.hbs)
});

// Login
app.get("/login", (req, res) => {
  res.render("login"); //res -> Render -> login Page (login.hbs)
});

// Account Creation
app.get("/account", (req, res) => {
  res.render("account-creation-page"); //res -> Render -> Account Creation Page (account-creation-page.hbs)
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
app.get("/about", (req, res) => {//res -> Render -> About Us Page (about.hbs)
  res.render("about", {
    team: [
      { name: 'Renee Messersmith', role: 'Team Lead', image: '/img/renee.png'},
      { name: 'Cynthia Rincon', role: 'Front-end', image: '/img/cynthia.png'},
      { name: 'Imani Moore', role: 'Back-end', image: '/img/imani.png'},
      { name: 'Elhadji Massow Ndiaye', role: 'Front-end', image: '/img/elhadji.png'},
      // { name: 'Amadeo', role: 'Front-end', image: '/img/Aqr.png'} 
    ]
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
