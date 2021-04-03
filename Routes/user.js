var express = require("express")
var router = express.Router()

const { isAdmin, isAuthenticated, isSignedin, } = require("../Controllers/auth")
const { updateUser, getUserById, getaUser, pushOrderInPurchaseList, userPurchaseList } = require("../Controllers/user")

//params
router.param("userId", getUserById)


router.get("/user/:userId", getaUser)
router.put("/update/user/:userId", isSignedin, isAuthenticated, updateUser)
router.get("orders/user/:userId", isSignedin, isAuthenticated, pushOrderInPurchaseList, userPurchaseList)

module.exports = router