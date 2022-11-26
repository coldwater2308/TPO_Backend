const express = require("express");
const test = require("../routes/test");
const adminRoutes = require("../routes/admin")
const studentRoutes = require('../routes/student')
module.exports = function (app) {
  app.use("/api/student/", studentRoutes);
  app.use("/api/admin/",adminRoutes);
 
};
