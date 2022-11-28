const axios= require('axios');
const Application = require('../models/Application');
const Post = require('../models/Post');
const Student = require('../models/Student');

const login = async(req,res,next)=>{
  try {
    const { email, password } = req.body
   
    const user = await Student.findByCredentials(email, password)
   
    if (!user) {
      return res.status(401).send({error: 'Login failed! Check authentication credentials'})
  }

    const token = await user.generateAuthToken()
    res.status(200).json({
      message : "Success",
      token:token,
      isAdmin:false,
      isProfileComplete : user?.isProfileComplete
    })
} catch (error) {

    res.status(400).send(error)
}
}
const profile = async(req,res,next)=>{
  try {
    let student = req.student
    return res.status(200).json(student)
  } catch (err) {
    res.status(400).json({
      message : "error",
      error : err
    })
  }
}
const editProfile = async(req,res,next)=>{
try {
  let payloadData = req.body
  let id = req.student.id
  payloadData.isProfileComplete= true
  let update = await Student.findByIdAndUpdate(id,payloadData,{new : true})
  return res.status(200).json({
    message : "Success"
  })
} catch (err) {
  res.status(400).json({
    message : "error",
    error : err
  })
}
}
const apply= async(req,res,next)=>{
  try {
    let student = req.student
    let application = new Application({
      postId : req.body.postId,
      role : req.body.role,
      studentId : student._id ,
      branchId : student.branchId,
      batchId : student.batchId
    })
    await application.save();
    return res.status(200).json(application)
  
  } catch (err) {
    res.status(400).json({
      message : "error",
      error : err
    })
  }
}
const getApplications = async(req,res,next)=>{
  try { 
    let student = req.student
    let applications = await Application.find({studentId : student._id,isDeleted : false, isBlocked : false})
    return res.status(200).json(applications)
  } catch (error) {
    res.status(400).json({
      message : "error",
      error : err
    })
  }
}
const getCurrentPost = async(req,res,next)=>{
  try {
    let payloadData= req.body

    let criteria = {
      isDeleted : false,
      isBlocked : false,
      status: 'active',
      lastDate : {$gte : new Date()}
    } 
    if(payloadData.type)
    criteria.type = payloadData.type
    if(payloadData.batchId)
    criteria.batchId = payloadData.batchId
    if(payloadData.branchId)
    criteria.branchId = payloadData.branchId

    if(payloadData.select ==0){
      let postIds=[]
      let application = await Application.find({isDeleted : false , isBlocked:false, isOffered : false , studentId: req.student._id})
     for(let key of application)
     postIds.push(key.postId)
      criteria._id = {$in : postIds}

    }
    if(payloadData.select ==1){
      let postIds=[]
      let application = await Application.find({isDeleted : false , isBlocked:false, isOffered : true , studentId: req.student._id})
     for(let key of application)
     postIds.push(key.postId)
      criteria._id = {$in : postIds}

    }
  
    let posts= await Post.find(criteria)
    return res.status(200).json(posts)
  } catch (error) {
    return res.status(400).json({
      message : "error"
    })
    
  }
}


module.exports = {
  login,
  profile,
  editProfile,
  apply,
  getApplications,
  getCurrentPost
};
