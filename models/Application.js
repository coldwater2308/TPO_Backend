let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let applicationSchema = new Schema({
     studentId : {type: Schema.ObjectId,ref:'Student',sparse :true},
     status : {type : String , default : 'applied'},   
     remarks : [{remark : String, time : Date}],
     role : {type : String},
     branchId : {type: Schema.ObjectId,ref:'Branch',sparse :true},
     batchId : {type: Schema.ObjectId,ref:'Branch',sparse :true},
     postId : {type: Schema.ObjectId,ref:'Post',sparse :true},
     isOffered : {type : Boolean, default : false},
     ctc : {type : String},
     isDeleted : {type : Boolean, default : false},
     isBlocked : {type : Boolean, default : false},


},{
    timestamps : true
});

module.exports = mongoose.model('Application', applicationSchema);