
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let studentSchema = new Schema({
  
    email : {type : String},
    password : {type : String},
    name :{type : String},
    rollNo : {type : String},
    gender : {type : String},
    phoneNo : {type : Number},
    dob : {type : Date},
    branchId : {type: Schema.ObjectId,ref:'Branch',sparse :true},
    batchId : {type: Schema.ObjectId,ref:'Branch',sparse :true},
    backlogs: {type : Number},
    educationGap :{type : Number},
    resume: {type : String},
    application: {type : String},
    undertaking: {type : String},
    highSchoolPercentage: {type : String},
    highSchoolCGPA : {type :String},
    interPercentage: {type : String},
    interCGPA : {type :String},
    bTechPercentage: {type : Number},
    bTechCGPA : {type :String},
    highSchoolPassingYear : {type :Number},
    interPassingYear: {type : Number},
    btechYear : {type :Number},
    isDeleted : {type : Boolean, default : false},
    isBlocked : {type : Boolean, default : false},
},{
    timestamps : true
});

studentSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
   
    next()
})

studentSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.STUDENT_JWT_SECRET)
    await user.save()
    return token
}

studentSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    
    const user = await Student.findOne({ email:email} )
    
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
 
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}
const Student = mongoose.model('Student', studentSchema);
module.exports= Student
