const axios = require("axios");
const Student = require("../models/Student");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Student.findByCredentials(email, password);

    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }

    const token = await user.generateAuthToken();
    res.status(200).json({
      message: "Success",
      token: token,
      isAdmin: false,
      isProfileComplete: user.isProfileComplete,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
const profile = async (req, res, next) => {
  try {
    let student = req.student;
    return res.status(200).json(student);
  } catch (err) {
    res.status(400).json({
      message: "error",
      error: err,
    });
  }
};
const editProfile = async (req, res, next) => {
  try {
    let payloadData = req.body;
    let id = req.student.id;
    let update = await Student.findByIdAndUpdate(id, payloadData, {
      new: true,
    });
    return res.status(200).json({
      message: "Success",
    });
  } catch (err) {
    res.status(400).json({
      message: "error",
      error: err,
    });
  }
};
const apply = async (req, res, next) => {
  try {
  } catch (err) {
    res.status(400).json({
      message: "error",
      error: err,
    });
  }
};

module.exports = {
  login,
  profile,
  editProfile,
  apply,
};
