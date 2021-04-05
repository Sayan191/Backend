const User = require("../Models/user")
const Order = require("../Models/Orders")
const { validationResult } = require("express-validator");
const { isBuffer } = require("lodash")


exports.getUserById = (req,res,next,id) =>{
    User.findById(id, (err, user)=>{
        if(err || !user){
            return res.status(401).json({
                error:"User Not Found"
            });
        }
        req.profile= user;
        next();
    })
}

exports.getaUser = (req,res) =>{
    req.profile.salt= undefined;
    req.profile.encrypted_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt= undefined;
    return res.json({
        name:req.profile.name,
        email:req.profile.email,
        _id:req.profile._id,
        role:req.profile.role,
        phone:req.profile.phone
    });
}
exports.updateUser = (req,res) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send({
            error:errors.array()[0].msg
        });
    }
    
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set : req.body},
        {new: true, useFindAndModify: false},
        (err,user)=> {
            if(err || !user){
                return res.status(401).json({
                    error:"Updating Failed"
                });
            }
            user.salt= undefined;
            user.encrypted_password = undefined;
            user.createdAt = undefined;
            user.updatedAt= undefined;
            return res.json({
                name:req.profile.name,
                email:req.profile.email,
                _id:req.profile._id,
                role:req.profile.role
            });
        }
    )
}


exports.userPurchaseList = (req,res) =>{
    Order.find({user: req.profile._id })
        .populate("user", "_id name")
        .exec((err,order)=>{
            if (err){
                return res.status(200).json({
                    error: "No order found"
                });
            }
            res.json(order);
        })
}


exports.pushOrderInPurchaseList = (req,res,next) =>{
    
    let purchases = []
    req.body.order.products.forEach((product)=>{
        purchases.push({
            _id: product._id,
            name: product.name,
            qauntity: product.qauntity,
            category: product.category,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    })

    //storing in DB
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err,items) =>{
            if(err){
                return res.status(400).json({
                    error:"Unable to save Purchase List"
                });
            }
            next();
        }
    )
}
