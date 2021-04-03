var express = require("express")
var router = express.Router()
const { check } = require("express-validator")
const { signup, signin, signout, isAdmin, isAuthenticated, isSignedin, verified } = require("../Controllers/auth")

//signup 
router.post("/signup",[
    check("name","Name should of minimum 3 letters").isLength({min:3}),
    check("email","Enter an valid email").isEmail(),
    check("password","Pasword must be of minimum 5 letters").isLength({min:5}),
    check("phone","Enter a valid number").isLength({min:5})
],signup );

//signin
router.post("/signin",[
    check("email","Enter an valid email").isEmail({min:3})
],signin);

//verifying user
router.post("/verify/user",verified)

//signout
router.get("/signout",signout);




//testing Route
router.get("/test", isSignedin, isAuthenticated, isAdmin, (req,res)=>{
    res.json("It Fucking Works")
})


module.exports = router