var express = require("express")
var router = express.Router()
const { check } = require("express-validator")

const { isAdmin, isAuthenticated, isSignedin, } = require("../Controllers/auth")
const { updateUser, getUserById, getaUser, pushOrderInPurchaseList, userPurchaseList } = require("../Controllers/user")

//params
router.param("userId", getUserById)


router.get("/user/:userId", getaUser)
router.put("/update/user/:userId",[
    check("name","Enter a valid name").isLength({min:4}),
    check("phone","Enter a valid number").isLength({min:10})],
    isSignedin, isAuthenticated, updateUser)
router.get("orders/user/:userId", isSignedin, isAuthenticated, pushOrderInPurchaseList, userPurchaseList)

module.exports = router