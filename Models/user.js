var mongoose = require("mongoose");
const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid');
const { Schema } = mongoose;
var Int32 = require('mongoose-int32');

var userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true,
    },
    en_password:{
        type:String,
        required:true
    },
    verified:{
      type:Boolean,
      default:false
    },
    salt: String,
    role:{
        type:Number,
        default:0
    },
    purchases:{
        type:Array,
        default:[]
    },
    sold:{
      type:Number,
      default:0
    },
    phone:{
      type:Number,
      required:true,
    }
},{timestamps:true});


userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.en_password = this.secure(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  authenticate: function(plainpassword) {
    return this.secure(plainpassword) === this.en_password;
  },

  secure: function(plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
      .createHmac('sha256', this.salt)
      .update(plainpassword)
      .digest('hex');
    } catch (err) {
      console.log("cccc",err)
      return "";
    }
  }
};


module.exports = mongoose.model("User", userSchema);