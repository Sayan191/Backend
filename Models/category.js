const mongoose = require("mongoose")
const { Schema } = mongoose;

const categorySchema = new Schema({
    collegename:{
        type:String,
        default:"Asansol Engineering College"
    },
    year:{
        type:Number,
        enum : [1,2,3,4],
        required:true
    },
    type:{
        type:String,
        required:true,
        default: "Book",
        enum : ["Book","Organizer"]
    }
},{timestamp: true})

module.exports = mongoose.model("Category", categorySchema);