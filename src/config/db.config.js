require('dotenv').config();
const mongoose = require("mongoose");


const mongodbLocalUri = process.env.MONGO_LOCAL_URL;
mongoose
  .connect(mongodbLocalUri, {})
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Connection error: " + error);
  });
