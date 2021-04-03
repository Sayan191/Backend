const mongoose = require("mongoose")
const schema=mongoose.Schema;
const {ObjectId} = schema;

const orderSchema = new schema ({
    products:{
        type:ObjectId,
        ref:"P_Cart"
    },
    transaction_id:{},
    amount:{type:Number},
    ordered_on: Date,
    user:{
        type:ObjectId,
        ref:"User"
    },
    d_address:{
        type:String,
        required:true
    },
    d_time:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["Ordered","Message Sent","Replied","Recieved"],
        default:"Ordered"
    }
},{timestamps:true})


module.exports = mongoose.model("Order",orderSchema)