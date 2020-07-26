const mongoose = require("mongoose");
// creates a new Express server
const express = require("express");
const app = express();
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

// locally, server will run on port 5000
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hawaiian food for lunch!"));
// tells Express to start a socket and listen for connections on the path
app.listen(port, () => console.log(`Server is running on port ${port}`));