const mongoose = require("mongoose");
// creates a new Express server
const express = require("express");
const app = express();
const db = require("./config/keys").mongoURI;
const users = require("./routes/api/users");
const listings = require("./routes/api/listings");
const bodyParser = require("body-parser");

mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

// locally, server will run on port 5000
const port = process.env.PORT || 5000;

// set up middleware for body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app will be listening for get requests --> give 2 args to the callback (request object and response object)
app.get("/", (req, res) => {
  debugger;
  res.send("Hawaiian food for lunch!");
});
app.use("/api/users", users);
app.use("/api/listings", listings);



// tells Express to start a socket and listen for connections on the path
app.listen(port, () => console.log(`Server is running on port ${port}`));