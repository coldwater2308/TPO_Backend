const express = require("express");
const router = express.Router();
const auth = require("../middlewares/admin");
const adminController = require("../controllers/adminControllers");
const studentController = require("../controllers/studentController");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
});

const s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "3d-idesign",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + path.extname(file.originalname));
    },
  }),
});
const uploadXLSX = multer({ dest: "./File" });

//login for admin
router.post("/login", adminController.login);

router.post("/addStudent", auth, adminController.addStudent);
router.post(
  "/addStudents",
  auth,
  uploadXLSX.single("file"),
  adminController.addStudents
);

router.get("/getStudents", auth, adminController.getStudents);

router.post("/addBranch", auth, adminController.addBranch);
router.post("/addBatch", auth, adminController.addBatch);

router.post("/addPost", adminController.addPost);
router.get("/getPosts", auth, adminController.getPosts);
router.get("/getCurrentPost", auth, adminController.getCurrentPost);
router.get("/getPost", auth, adminController.getPost);

router.post("/markAppStatus", auth, adminController.markAppStatus);

router.get("/getBranch", adminController.getBranch);
router.get("/getBatch", adminController.getBatch);
router.post("/deleteBranch", auth, adminController.deleteBranch);

router.get("/getAppliedStudents", auth, adminController.getAppliedStudents);

module.exports = router;
