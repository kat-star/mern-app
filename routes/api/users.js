const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const keys = require("../../config/keys");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validateLoginInput = require("../../validation/login");
const validateRegisterInput = require("../../validation/register");

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

// private auth route
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  // returning the user in the authentication route
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email
  });
});

// route to register new users
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // check to see that no one has previously registered with a duplicate username
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      // if email already exists throw a 400 error
      errors.username = "User already exists";
      return res.status(400).json(errors);
    } else {
      // else create a new user & encrypt password via bcrypt
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
          // will return a promise and then send back to the front end. Get user back from DB
            .then(user => {
              const payload = { id: user.id, username: user.username };

              jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                res.json({
                  success: true,
                  token: `Bearer ${token}`
                });
              });
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// login route 
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  
  // check if username exists
  User.findOne({ email })
    .then(user => {
      // if no valid email throw 400 error
      if (!user) {
        errors.email = "This user does not exist";
        return res.status(400).json(errors);
      }
      // compares user inputted password with the salted/hashed password in the DB
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = { id: user.id, username: user.username, email: user.email };
            
            // return a signed web token with each login or register request to sign user in on the frontend
            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
              res.json({
                success: true,
                token: `Bearer ${token}`
              });
            })
          } else {
            errors.password = "Incorrect password";
            return res.status(400).json(errors);
          }
        });
    });
});

module.exports = router;
