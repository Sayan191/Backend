const mongoose = require("mongoose");
const schema = mongoose.Schema;
const {ObjectId} = schema;

const productSchema = new schema({
    name:{
        type:String,
        minlength:4,
        required:true
    },
    condition:{
        type:String,
        maxlength:150
    },
    category:{
        type:ObjectId,
        ref:"Category"
    },
    price:{
        type:Number,
        default:0,
        required:true
    },
    image : {
        data : Buffer,
        contentType: String
    }
},{timestamps:true})



module.exports =mongoose.model("Product",productSchema)