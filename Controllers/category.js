const Category = require("../Models/category")
const { validationResult } = require("express-validator")
const { isBuffer} = require("lodash")
const Orders = require("../Models/Orders")

exports.getCategoryById = (req,res, next, id) =>{
    Category.findById(id, (err, category)=>{
        if(err || !category){
            return res.status(400).json({
                Error:"Category Not Found"
            });
        }
        req.profile = category
        next();
    })
}

exports.createCategory = (req, res) =>{
    
    const category = new Category(req.body)
    console.log(req.body)
    category.save((err,cate)=>{
        if(err){
            return res.status(400).json({
                Error:"Unable to save In DB"
            });
        }
        res.json(cate)
    })
}

exports.getaCategory = (req,res) => {
    res.json(req.profile)
}

exports.getAllCategory = (req,res) =>{
    Category.find().exec((err,cate)=>{
        if(err){
            return res.status(400).json({
                Error:"No Category Found"
            });
        }
        if(cate.length === 0){
            return res.json({
                Msg: "No Categories Are Made"
            });
        }
        res.json(cate)
    })
}

exports.updateCategory = (req,res) => {
    const category = req.profile
    console.log(req.profile,category.year)
    category.year = req.body.year
    console.log(req.body.year,category.year)

    category.save((err, updated)=>{
        console.log(err)
        if(err){
            return res.status(400).json({
                Error:"Unable to update"
            });
        }
        res.json(updated)
    })
}

exports.removeCategory = (req,res) =>{
    Category.findById(req.profile._id).deleteOne((err,removed) =>{
        if(err){
            return res.status(400).json({
                Error:"No Category Found "
            });
        }
        res.json({
            Msg:"Category Deleted"
        });
    })
}

