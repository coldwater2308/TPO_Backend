
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let adminSchema = new Schema({
  
    email : {type : String},
    password : {type : String}

},{
    timestamps : true
});

adminSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()
})

adminSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    await user.save()
    return token
}

adminSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    
    const user = await Admin.findOne({ email:email} )
    
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
 
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}
const Admin = mongoose.model('Admin', adminSchema);
module.exports= Admin
