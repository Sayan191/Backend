const mongoose = require("mongoose")
const schema = mongoose.Schema;
const {ObjectId} = schema;


const productcartSchema = new schema({
    product :{
        type:ObjectId,
        ref:"Product"
    },
    name:String,
    price:Number,
    count:Number
})

module.exports = mongoose.model("ProductCart",productcartSchema);
