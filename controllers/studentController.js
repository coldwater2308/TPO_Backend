const axios = require("axios");
const Application = require("../models/Application");
const Post = require("../models/Post");
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
      isProfileComplete: user?.isProfileComplete,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
const profile = async (req, res, next) => {
  try {
    return res.status(200).json(req.student);
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
    payloadData.isProfileComplete = true;
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
    let student = req.student;
    let application = new Application({
      postId: req.body.postId,
      role: req.body.role,
      studentId: student._id,
      branchId: student.branchId,
      batchId: student.batchId,
    });
    await application.save();
    return res.status(200).json(application);
  } catch (err) {
    res.status(400).json({
      message: "error",
      error: err,
    });
  }
};
const getApplications = async (req, res, next) => {
  try {
    let student = req.student;
    let applications = await Application.find({
      studentId: student._id,
      isDeleted: false,
      isBlocked: false,
    });
    return res.status(200).json(applications);
  } catch (error) {
    res.status(400).json({
      message: "error",
      error: err,
    });
  }
};
const getCurrentPost = async (req, res, next) => {
  try {
    let payloadData = req?.body;
    console.log("body");
    let applications = await Application.find({isDeleted : false,isBlocked:false,studentId : req.student._id})
    let postIds=[]
    for(let key of applications)
    postIds.push(key.postId)
    let criteria = {
      isDeleted: false,
      isBlocked: false,
      status: "active",
      lastDate: { $gte: new Date() },
      _id : {$nin : postIds}
    };
    if (payloadData.type) criteria.type = payloadData.type;
    if (payloadData.batchId) criteria.batchId = payloadData.batchId;
    if (payloadData.branchId) criteria.branchId = payloadData.branchId;
    if (payloadData.branchId) criteria.branchId = payloadData.branchId;
console.log("body->",payloadData.status)
if(payloadData.status ==0){
  criteria._id = {$in : postIds}
  delete criteria.lastDate
}
if(payloadData.status ==1){
  let app = await Application.find({isDeleted : false,isBlocked:false,studentId : req.student._id,isOffered : true})
  let pIds=[]
  for(let key of app)
  pIds.push(key.postId)
  criteria._id = {$in : pIds}
  delete criteria.lastDate
}
    let posts = await Post.find(criteria);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({
      message: "error",
    });
  }
};


module.exports = {
  login,
  profile,
  editProfile,
  apply,
  getApplications,
  getCurrentPost,
};
