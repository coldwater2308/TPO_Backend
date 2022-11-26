const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.

function mongoConnect() {
  mongoose.connect("mongodb+srv://mauryashubham:Kushal123@cluster0.yw8kq.mongodb.net/", (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection: " + err);
    }
  });
}

module.exports = mongoConnect;
