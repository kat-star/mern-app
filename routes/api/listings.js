const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const Listing = require("../../models/Listing");
const validateListingInput = require("../../validation/listings");
const { request } = require("express");

// protected route for a user to post a listing
router.post("/", passport.authenticate("jwt", { session: false}, (req, res) => {
  const { errors, isValid } = validateListingInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newListing = new Listing({
    text: req.body.text,
    user: req.user.id,
    image: request.user.image
  })

  newListing.save()
    .then(listing => res.json(listing));
}))

router.get("/", (req, res) => {
  Listing.find()
    .sort({ date: -1 })
    .then(listings => res.json(listings))
    .catch(err => res.status(400).json({ nolistingsfound: "No listings found" }));
});

router.get("/user/:user_id", (req, res) => {
  Listing.find({ user: req.params.user_id })
    .then(listings => res.json(listings))
    .catch(err => res.status(404).json({ nolistingsfound: "No listings found for that user" }));
});

router.get("/:id", (req, res) => {
  Listing.findById(req.params.id)
    .then(listing => res.json(listing))
    .catch(err => res.status(404).json({ notlistingfound: "No listings found for that ID"}));
});

router.get("/test", (req, res) => res.json({ msg: "This is the listings route" }));

module.exports = router;
