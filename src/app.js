require("dotenv").config();
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");

// DB Routes
const authRoutes = require("./routes/auth.js");
const journalRoutes = require("./routes/journal.js");
const moodRoutes = require("./routes/mood.js");
const contactRoutes = require("./routes/contact.js");

const auth = require("./middleware/auth.js");

const port = process.env.PORT || 8080;

//Initializing App
const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Parse incoming JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup handlebars engine and view location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// Landing Page
app.get("/", (req, res) => {
  res.render("landing"); // Renders landing.hbs
});

// Login
app.get("/login", (req, res) => {
  res.render("auth"); //res -> Render -> login Page (login.hbs)
});

// Homepage
app.get("/homepage", auth, (req, res) => {
  res.render("homepage", {
    user: {
      firstName: req.user.first_name,
      profileImg: req.user.profile_img,
    }
  }); //res -> Render -> homepage (homepage.hbs)
});

// Resources
app.get("/resources", auth, (req, res) => {
  res.render("resources"); //res -> Render -> resources Page (resources.hbs)
});

// About Us
app.get("/about", (req, res) => {
  res.render("about", {
    team: [
      { name: "Renee Messersmith", role: "Team Lead", image: "/img/renee.png" },
      { name: "Cynthia Rincon", role: "Front-end", image: "/img/cynthia.png" },
      { name: "Imani Moore", role: "Back-end", image: "/img/imani.png" },
      {
        name: "Elhadji Massow Ndiaye",
        role: "Front-end",
        image: "/img/elhadji.png",
      },
    ],
  });
});

// routes for Journal, Mood, and Login
app.use("/auth", authRoutes);
app.use("/journal", journalRoutes);
app.use("/mood", moodRoutes);
app.use("/contact", contactRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Something went wrong",
  });
});

//Server
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
