var express = require("express")
const { check } = require("express-validator")
var router = express.Router()

const { isSignedin, isAdmin, isAuthenticated } = require("../Controllers/auth")
const {  getCategoryById, createCategory,  getAllCategory, getaCategory, removeCategory, updateCategory} = require("../Controllers/category")
const { getUserById } = require("../Controllers/user")

//params
router.param("categoryId", getCategoryById)
router.param("userId", getUserById)
//creating Category
router.post("/create/category/:userId", isSignedin, isAuthenticated, isAdmin, createCategory)

//getting a category 
router.get("/category/:categoryId", getaCategory)

//getting all category
router.get("/categories", getAllCategory)

//upadting a category
router.put("/manage/category/:userId/:categoryId",isSignedin, isAuthenticated, isAdmin, updateCategory)

//deleting a category
router.delete("/remove/category/:userId/:categoryId",isSignedin, isAuthenticated, isAdmin, removeCategory)

module.exports = router