
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let postSchema = new Schema({

     file: {type : String},
     branchId : {type: Schema.ObjectId,ref:'Branch',sparse :true},
     batchId : {type: Schema.ObjectId,ref:'Branch',sparse :true},
     companyName : {type : String},
     type : {type : String , defaut : 'fullTime'}, //    fullTime Internship fullTimeWithIntern
     lastDate : {type : Date},
    driveDate : {type : Date},
    prePlacementTalkDate : {type : Date},
    testDates: [{type : Date}],
    interviewDates :[{type : Date}],
    ctc : {type : String},
    cgpaCutoff: {type: String},
    bond : {type : Number},
    roles : [{role : String , ctc : String}],
    status : {type : String , default : 'active'},
    isDeleted : {type : Boolean, default : false},
    isBlocked : {type : Boolean, default : false}
    
},{
    timestamps : true
});

module.exports = mongoose.model('Post', postSchema);