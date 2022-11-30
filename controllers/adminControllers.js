const Admin = require("../models/Admin");
const Application = require("../models/Application");
const Batch = require("../models/Batch");
const Branch = require("../models/Branch");
const Post = require("../models/Post");
const Student = require("../models/Student");
const mongoXlsx = require("mongo-xlsx");
const bcrypt = require("bcryptjs");
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("{ email, password }", { email, password });

    const user = await Admin.findByCredentials(email, password);
    console.log("Admin found", user);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }

    const token = await user.generateAuthToken();
    res.status(200).json({
      message: "Success",
      token: token,
      isAdmin: true,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
const addStudent = async (req, res, next) => {
  try {
    let payloadData = req.body;

    if (payloadData.email && payloadData.password) {
      let student = new Student({
        email: payloadData.email,
        password: payloadData.password,
      });
      await student.save();

      return res.status(200).json({
        message: "Successfully Registered",
      });
    } else
      return res.status(400).json({
        message: "Missing Details",
      });
  } catch (error) {
    res.status(400).json(error);
  }
};
const addStudents = async (req, res, next) => {
  let branchId = req.body.branchId;
  let batchId = req.body.batchId;
  let file = req.file.path;

  try {
    let students = [];
    mongoXlsx.xlsx2MongoData(file, null, async (err, data) => {
      if (err) return res.status(400).json(err);

      for (let key of data) {
        let password = await bcrypt.hash(key.password, 8);
        students.push({
          email: key.email,
          rollNo: key.rollNo,
          password: password,
          batchId: batchId,
          branchId: branchId,
        });
      }
      await Student.insertMany(students);
    });
    return res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};

const addBranch = async (req, res, next) => {
  try {
    let branch = new Branch(req.body);
    await branch.save();
    return res.status(200).json({
      message: "Success",
      data: branch,
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};
const addBatch = async (req, res, next) => {
  try {
    let batch = new Batch(req.body);
    await batch.save();
    return res.status(200).json({
      message: "Success",
      data: batch,
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};
const addPost = async (req, res, next) => {
  try {
    let payloadData = req.body;
    console.log("body", res.body);
    let post = new Post(payloadData);
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    return res.status(400).json({
      message: "error",
    });
  }
};
const getCurrentPost = async (req, res, next) => {
  try {
    let payloadData = req.body;

    let criteria = {
      isDeleted: false,
      isBlocked: false,
      status: "active",
      lastDate: { $gte: new Date() },
    };
    if (payloadData.type) criteria.type = payloadData.type;
    if (payloadData.batchId) criteria.batchId = payloadData.batchId;
    if (payloadData.branchId) criteria.branchId = payloadData.branchId;
    let posts = await Post.find(criteria);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({
      message: "error",
    });
  }
};
const getStudents = async (req, res, next) => {
  try {
    let payloadData = req.query;
    let criteria = {
      isDeleted: false,
      isBlocked: false,
    };
    if (payloadData.isPlaced == 1) {
      let data = [];
      let placedStudents = await Application.find({
        isDeleted: false,
        isBlocked: false,
        isOffered: true,
      });
      for (let key of placedStudents) data.push(key.studentId);
      criteria._id = { $in: data };
    }

    if (payloadData.search) {
      criteria.$or = [
        { name: new RegExp("^" + payloadData.search, "i") },
        { email: new RegExp("^" + payloadData.search, "i") },
        { phoneNo: new RegExp("^" + payloadData.search, "i") },
      ];
    }
    if (payloadData.batchId) criteria.batchId = payloadData.batchId;

    if (payloadData.branchId) criteria.branchId = payloadData.branchId;
    let options = {
      sort: { rollNo: 1 },
    };
    let students = await Student.find(criteria, {}, options)
      .populate({
        modal: Branch,
        path: "branchId",
      })
      .populate({
        modal: Batch,
        path: "batchId",
      });
    return res.status(200).json(students);
  } catch (error) {
    return res.status(400).json({
      message: "error",
    });
  }
};
const getPosts = async (req, res, next) => {
  try {
    let payloadData = req?.body;

    let criteria = {
      isDeleted: false,
      isBlocked: false,
    };
    if (payloadData.type) criteria.type = payloadData.type;
    if (payloadData.status) criteria.status = payloadData.status;
    if (payloadData.batchId) criteria.batchId = payloadData.batchId;
    if (payloadData.branchId) criteria.branchId = payloadData.branchId;
    let posts = await Post.find(criteria);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({
      message: "error",
    });
  }
};
const markAppStatus = async (req, res, next) => {
  try {
    id = req.body.id;
    let data = await Application.findByIdAndUpdate(
      id,
      {
        status: req.body.status,
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Successfully Updated",
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};
const getPost = async (req, res, next) => {
  try {
    let id = req.body.id;
    let post = await Post.findById(id);
    let applications = await Application.find({ postId: id }).populate({
      path: "studentId",
      modal: Student,
    });
    return res.status(200).json({
      message: "Success",
      post: post,
      applications: applications,
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};
const getBatch = async (req, res, next) => {
  try {
    let batch = await Batch.find({ isDeleted: false, isBlocked: false });
    return res.status(200).json(batch);
  } catch (error) {
    res.status(400).send(error);
  }
};
const getBranch = async (req, res, next) => {
  try {
    let branch = await Branch.find({ isDeleted: false, isBlocked: false });
    return res.status(200).json(branch);
  } catch (error) {
    res.status(400).send(error);
  }
};
const deleteStudents = async (req, res, next) => {
  try {
    let studentIds = req.body.studentId;
    await Student.updateMany({ _id: { $in: studentIds } }, { isDeleted: true });
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).send(error);
  }
};
const blockStudents = async (req, res, next) => {
  try {
    let studentIds = req.body.studentId;
    await Student.updateMany({ _id: { $in: studentIds } }, { isBlocked: true });
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).send(error);
  }
};
const getAppliedStudents = async (req, res, next) => {
  try {
    let payloadData = req.query;
    let postId = payloadData.postId;
    let criteria = {
      isDeleted: false,
      isBlocked: false,
      postId: postId,
    };
    let applications = await Application.find(criteria)
      .populate({
        modal: Student,
        path: "studentId",
      })
      .populate({
        modal: Branch,
        path: "branchId",
      })
      .populate({
        modal: Batch,
        path: "batchId",
      });

    let data = [];
    for (let key of applications) {
      (key.studentId.branch = key.branchId?.code),
        (key.studentId.batch = key.batchId?.name);

      data.push(key.studentId);
    }
    const csvString = [
      [
        "email",
        "name",
        "rollNo",
        "gender",
        "phoneNo",
        "dob",
        "branch",
        "batch",
        "backlogs",
        "educationGap",
        "resume",
        "application",
        "undertaking",
        "highSchoolPercentage",
        "highSchoolCGPA",
        "interPercentage",
        "interCGPA",
        "bTechPercentage",
        "bTechCGPA",
        "highSchoolPassingYear",
        "interPassingYear",
        "btechYear",
      ],
      ...data.map((item) => [
        item.email,
        item.name,
        item.rollNo,
        item.gender,
        item.phoneNo,
        item.dob,
        item.branch,
        item.batch,
        item.backlogs,
        item.educationGap,
        item.resume,
        item.highSchoolPercentage,
        item.highSchoolCGPA,
        item.interPercentage,
        item.interCGPA,
        item.bTechPercentage,
        item.bTechCGPA,
        item.highSchoolPassingYear,
        item.interPassingYear,
        item.btechYear,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");
    return res.status(200).json(csvString);
  } catch (error) {
    res.status(400).send(error);
  }
};
const deleteBranch = async (req, res, next) => {
  try {
    let branchId = req.body.branchId;
    await Branch.updateMany({ _id: branchId }, { isDeleted: true });
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  login,
  addBranch,
  addBatch,
  addStudent,
  addStudents,
  getStudents,
  addPost,
  getPost,
  getPosts,
  getCurrentPost,
  markAppStatus,
  getBatch,
  getBranch,
  blockStudents,
  deleteStudents,
  getAppliedStudents,
  deleteBranch,
};
