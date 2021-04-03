var express = require("express")
var router = express.Router()

const { getOrderById,createOrder, getAllOrder,getOrders,updateOrderStatus,getOrderStatus, cancelOrder }  =require("../Controllers/order")
const { isAdmin,isAuthenticated,isSignedin } =require("../Controllers/auth")
const { getUserById,pushOrderInPurchaseList }= require("../Controllers/user")
const {  } =require("../Controllers/product")

router.param("userId", getUserById)
router.param("orderId", getOrderById)

router.post("/order/create/:userId/:orderId", isSignedin, isAuthenticated, pushOrderInPurchaseList, createOrder)
router.get("/orders/all/:userId", isSignedin,isAuthenticated,isAdmin, getAllOrder)
router.get("/order/status/:userId/:orderId", isSignedin,isAuthenticated, getOrderStatus)
router.put("/order/manage/:userId/:orderId", isSignedin, isAuthenticated, isAdmin, updateOrderStatus)
router.delete("/order/cancel/:userId/:orderId", isSignedin, isAuthenticated, cancelOrder)


module.exports = router