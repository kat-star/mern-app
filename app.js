const mongoose = require("mongoose");
// creates a new Express server
const express = require("express");
const app = express();
const db = require("./config/keys").mongoURI;
const users = require("./routes/api/users");
const listings = require("./routes/api/listings");
const bodyParser = require("body-parser");
const passport = require("passport");

mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello World!!"))

app.use(passport.initialize());
require("./config/passport")(passport);

// set up middleware for body parser (tell app to respond to json and other software like Postman)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// add the middleware for Passport

app.use("/api/users", users);
app.use("/api/listings", listings);

// locally, server will run on port 5000
const port = process.env.PORT || 5000;
// tells Express to start a socket and listen for connections on the path
app.listen(port, () => console.log(`Server is running on port ${port}`));