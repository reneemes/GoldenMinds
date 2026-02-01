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

// ==== Landing Page ====
app.get("/", (req, res) => {
  res.render("landing"); // Renders landing.hbs
});


// ==== Login ====
app.get("/login", (req, res) => {
  res.render("auth"); //res -> Render -> login Page (login.hbs)
});

// ==== Homepage ====
app.get("/homepage", auth, (req, res) => {
  //<-- NEED ATTENTION
  res.render("homepage"); //res -> Render -> homepage (homepage.hbs)
});

// ==== JOURNAL ====
// Fake logged-in user
app.use((req, res, next) => {
  req.user = { id: 1 }; // simulate logged-in user
  next();
});

// In-memory journal storage
let journals = []; // will hold all journal entries

// Creation Journal Entry
app.post("/journal", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content required" });
  }

  const newEntry = {
    id: Date.now(), // simple unique ID
    title,
    content,
    user_id: req.user.id,
    created_at: new Date().toISOString(),
  };

  journals.push(newEntry);

  res.status(201).json({
    message: "Journal created!",
    journalId: newEntry.id,
  });
});

// Getting all journal entrys
app.get("/journal", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  // return only this user's journals
  const userJournals = journals.filter((j) => j.user_id === req.user.id);

  res.status(200).json({ journalEntries: userJournals });
});

// Deleting Journal
app.delete("/journal/:journalId", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const journalId = parseInt(req.params.journalId);

  journals = journals.filter(
    (j) => j.id !== journalId || j.user_id !== req.user.id,
  );

  const userJournals = journals.filter((j) => j.user_id === req.user.id);

  res.status(200).json({
    message: "Journal entry deleted",
    journalEntries: userJournals,
  });
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
      { name: "Elhadji Massow Ndiaye", role: "Front-end", image: "/img/elhadji.png" },
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
