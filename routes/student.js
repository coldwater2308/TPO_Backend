const express = require("express");
const router = express.Router();
const auth = require("../middlewares/student");
const studentControllers = require("../controllers/studentController");
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
      cb(null, Date.now().toString()+path.extname(file.originalname));
    },
  }),
});

router.post('/login',studentControllers.login)
router.get('/profile',auth,studentControllers.profile)
router.put('/editProfile',auth,studentControllers.editProfile)
router.post('/apply',auth,studentControllers.apply)
router.post('/getCurrentPost',auth,studentControllers.getCurrentPost)
// router.get('getAppliedPosts',auth,studentControllers.getAppliedPosts)


module.exports = router;
