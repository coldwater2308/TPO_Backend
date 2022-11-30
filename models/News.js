let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let newsSchema = new Schema(
  {
    file: [{ type: String }],
    branchId: { type: Schema.ObjectId, ref: "Branch", sparse: true },
    batchId: { type: Schema.ObjectId, ref: "Branch", sparse: true },
    companyName: { type: String },
    jobType: { type: String, default: "fullTime" }, //    fullTime internship fullTimeWithIntern
    title : {type : String},
    description : {type : String},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("News", newsSchema);
