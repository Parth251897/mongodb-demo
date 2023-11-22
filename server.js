const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("./src/config/db.config.js")
require('dotenv').config();

const roleRoutes = require("./src/routes/userroutes/Userroute.js")
const commonRoutes = require("./src/routes/commonroutes/Commonroute.js")
const adminRoutes = require("./src/routes/adminroutes/Adminroute.js")
const productroutes = require("./src/routes/productroute/productroute.js")
const cartroute = require("./src/routes/productroute/cartroute.js")

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", roleRoutes);
app.use("/common", commonRoutes);
app.use("/admin", adminRoutes);
app.use("/product", productroutes);
app.use("/cart", cartroute);




const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
