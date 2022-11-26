
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let batchSchema = new Schema({
        name : {type : String},
        year :   {type : Number},
        isDeleted : {type : Boolean, default : false},
        isBlocked : {type : Boolean, default : false},
   
},{
    timestamps : true
});


const Batch = mongoose.model('Batch', batchSchema);
module.exports =Batch