const express = require("express");
require("dotenv").config();
const db = require("./utils/db-connection");
const cors = require("cors");
const path = require("path");

//import modules
require("./models/userModel");

//import routes
const userRoute = require("./routes/userRoute");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());


app.use("/api/user", userRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view/signup.html"));
});

const PORT = process.env.PORT;

db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
