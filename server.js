const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
const bcrypt= require('bcryptjs')
app.use(cors({
  origin: '*'
}));
dotenv.config(); 
require("./config/db")();
app.use(express.json())
require("./startup/router")(app);
const port = 4000;

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
