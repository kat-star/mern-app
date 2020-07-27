const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

// // route to register new users
// router.post("/register", (req, res) => {
//   User.findOne({ email: req.body.email})
//     .then(user => {
//       // if email already exists throw a 400 error
//       if (user) {
//         return res.status(400).json({ email: "A user has already registered with this address"});
//       // else create a new user & encrypt password via bcrypt
//       } else {
//         const newUser = new User({
//           username: req.body.username,
//           email: req.body.email,
//           password: req.body.password
//         })

//         bcrypt.genSalt(10, (err, salt) => {
//           bcyrpt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;
//             newUser.password = hash;
//             newUser.save()
//               .then(user => res.json(user))
//               .catch(err => console.log(err))
//           })
//         })
//       }
//     })
// })

// route to register new users
router.post("/register", (req, res) => {
  // check to see that no one has previously registered with a duplicate email
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      // if email already exists throw a 400 error
      return res
        .status(400)
        .json({ email: "A user has already registered with this address" });
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
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
