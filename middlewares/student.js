const jwt = require("jsonwebtoken");
const admin = require("../models/Admin");
const Student = require("../models/Student");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log("token!", token);
    if (!token) throw new Error();

    const data = jwt.verify(token, process.env.STUDENT_JWT_SECRET);

    const student = await Student.findOne({ _id: data._id });

    if (!student) {
      throw new Error();
    }
    req.student = student;
    console.log("VERIFIED!");
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};
module.exports = auth;
