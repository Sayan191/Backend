const Product = require("../Models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Category = require("../Models/category")
let arr = []


exports.getProductById = (req,res,next,id) =>{
    Product.findById(id, (err,product)=>{
        if(err){
            return res.status(400).json({
                Error:"Product Not Found"
            });
        }
        req.product = product
        next()
    })
}

exports.createProduct = (req,res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file)=>{
        if (err){
            return res.status(400).json({
                err:"Error in File"
            });
        }

        //destruturing all fields
        const { name , category, price,condition} = fields
        if (!name || !category || !price || !condition){
            return res.status(400).json({
                err: "All fields are required"
            });
        }

        let product = new Product(fields)
        if(file.image){
            if(file.image.size > 3000000){
                return res.status(400).json({
                    err:"Warning: File Size Too Large"
                });
            }

            product.image.data = fs.readFileSync(file.image.path)
            product.image.contentType = file.image.type
        }
        console.log(product)
        product.save((err,product) =>{
            if(err){
                return res.status(400).json({
                    err:"Unable to save in DB"
                });
            }
            res.json(product)
        })

    })
}

exports.getAllProduct =(req,res) =>{
    
    let limit  = req.query.limit ? parseInt(req.query.limit) : 10 
    let sortBy = req.query.sortBy ? req.query.sortBy : "category"
    Product.find()
        .select("-image")
        .populate("Category")
        .limit(limit)
        .sort([[sortBy, "asc"]])
        .exec((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"NO product found"
                });
            }
            res.json(product)
        })
}

/*getting category name

const getCategoryName = (id) =>{
    Category.findById(id).exec((err,cate)=>{
        arr.push(cate.year)
        console.log(arr)
    })
}*/

exports.getAllUniqueProducts = (req,res) =>{
    Product.distinct("category", {}, (err, category)=>{
        if(err || category.length === 0){
            return res.status(400).json({
                err:"No category Found"
            });
        }
        res.json(category)
    })
}

exports.getProduct = (req,res) =>{
    console.log(req.product)
    req.product.image.data = undefined
    res.json(req.product);
}

exports.updateProduct = (req,res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file)=>{
        if (err){
            return res.status(400).json({
                err:"Error in File"
            });
        }

        //destruturing all fields
        const { name , category, price,condition} = fields
        
       let product = req.product
        product = _.extend(product, fields)

        if(file.image){
            if(file.image.size > 3000000){
                return res.status(400).json({
                    err:"File Size Too Large"
                });
            }

            product.image.data = fs.readFileSync(file.image.path)
            product.image.contentType = file.image.type
        }
        product.save((err,product) =>{
            if(err){
                return res.status(400).json({
                    err:"Unable to save in DB"
                });
            }
            res.json(product);
        })

    })
}

exports.deleteProduct = (req,res) =>{
    let product = req.product
    product.remove((err,deleted) => {
        if(err){
            return res.status(400).json({
                err:"Unable to delete product"
            });
        }
        res.json({
            Msg:"Product deleted Successfully",
            deleted
        });
    })
}

//middleware
exports.photo = (req,res,next) =>{
    if(req.product.image.data){
        res.set("Content-Type",req.product.image.contentType)
        return res.send(req.product.image.data);
    }
    next()
}

