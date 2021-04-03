const Order = require("../Models/Orders");

exports.getOrderById = (req,res,next,id)=>{
    Order.findById(id)
    .populate("products.product", "name price")
    .exec((err,order) =>{
        if(err){
            return res.status(400).json({
                Error:"Order Not Found"
            });
        }
        req.order = order
        next();
    })
}

exports.createOrder = (req,res) =>{
    req.body.order.user = req.profile
    const order = new Order(req.ody.order)
    Order.save((err,order)=>{
        if(err){
            return res.status(400).json({
                Error:"Unable to save order"
            });
        }
        res.json(order);
    })
}

exports.getAllOrder = (req,res) =>{
   Order.find()
   .populate("user", " _id name")
   .exec((err,order)=>{
       if(err){
           return res.status(400).json({
               error:"No order found"
           });
       }
       res.json(order);
   })
}

exports.getOrders = (req,res) =>{
    Order.find()
        .populate("user", "_id name")
        .exec((err, order)=>{
            if(err){
                return res.status(400).json({
                    error:"No order found"
                });
            }
            res.json(order);
        })
}

exports.cancelOrder = (req,res)=>{
    Order.findById(req.order._id)
    .populate("user", "_id name ")
        .deleteOne((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No order found"
            });
        }
        res.json({
            msg:"Order Cancelled Successfully",
            order
        });
    })
}

exports.getOrderStatus = (req, res) =>{
    res.json(Order.schema.path("status").enumValues);
}

exports.updateOrderStatus = (req, res) =>{
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order)=>{
            if(err){
                return res.status(400).json({
                    errorr: "Unable to update status"
                });
            }
            res.json(order);
        }
    )

}