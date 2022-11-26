
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let branchSchema = new Schema({
        name : {type : String},
        code : {type : String},
        year :   {type : Number},
        isDeleted : {type : Boolean, default : false},
        isBlocked : {type : Boolean, default : false},
   
},{
    timestamps : true
});


const Branch = mongoose.model('Branch', branchSchema);
module.exports =Branch