const express = require("express");
const { geocode } = require("../controllers/geolocationController");

const router = express.Router();

// GET /api/geocode
router.get("/", geocode);

module.exports = router;
