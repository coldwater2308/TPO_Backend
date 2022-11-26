let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let applicationSchema = new Schema({
     studentId : {type: Schema.ObjectId,ref:'Student',sparse :true},
     status : {type : String , default : 'applied'},   
     remarks : [{remark : String, time : Date}],
     role : {type : String},
     postId : {type: Schema.ObjectId,ref:'Post',sparse :true},
     isOffered : {type : Boolean, default : false},
     ctc : {type : String},
     isDeleted : {type : Boolean, default : false},
     isBlocked : {type : Boolean, default : false},


},{
    timestamps : true
});

module.exports = mongoose.model('Application', applicationSchema);