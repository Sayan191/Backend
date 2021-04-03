const User = require("../Models/user")
const { validationResult } = require("express-validator");
var jwt = require('jsonwebtoken')
var expressJwt= require("express-jwt");

//const mailgun = require("mailgun-js");
//const DOMAIN = "sandboxb5dca784d3604d25957a7de7e6a710ab.mailgun.orgs";
//const mailg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});

"use strict";
const nodemailer = require("nodemailer");


exports.signup=(req,res)=>{    
    // res.json({message:"signup working successfully!"})

    //checking for errors
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(422).send({
            error: errors.array()[0].msg,
            param: errors.array()[0].param
        });
    }
    //checking for duplicate accounts 
    const {email,phone,name,password } = req.body;

    User.findOne({phone},(err,user)=>{
        if(user){
            return res.status(400).json({
                error:"Mobile Number already exists"
            });
        }
    })  

        const token = jwt.sign({name,email,password}, process.env.SECRET,{expiresIn:"30m"})
        //verifying user    
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 8000,
            secure: false, 
            auth: {
                user: "sayantalukdar30@gmail.com",
                pass: "Sayan@123",
            },
        });
      
        // send mail with defined transport object
        let information = {
            from: "sayantalukdar30@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Account activation link",  
            html: `
                <b>Hello ${name}</b>
                <h2>Please click on the below link to activate your account</h2>
                <a >${process.env.CLIENT_URL1}/authenticate/activation/${token}</a>
                <br>
                <p>Link valid for 30 minutes only</p>
            `, 
        }

        transporter.sendMail(information,function(error,info){
            if(error){
                    return res.status(400).json({
                        err:error
                    });
            }
            else{
                //console.log("Message sent: %s", info.messageId);
                //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                res.status(200).json({
                    message:"Email has been sent to your account"
                });
            }
        })
      
    

    User.findOne({email},(err,user)=>{
        if(user){
            return res.status(400).json({
                error:"Email already exists"
            });
        }


        if(err || err === null ){
            //storing json data
            const user1 = new User(req.body);
            //saving json data from rqst
            user1.save((err,user)=>{
                if(err){
                    return res.status(400).json({
                        error:"NOT able to save user in Database"
                    });
                } 

                res.json({
                    name : user.name,
                    email : user.email,
                    id : user._id
                });
            })
        }
        
    })

}

exports.signin =(req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send({
            error:errors.array()[0].msg
        });
    }
    const {email, password} = req.body;
    User.findOne({email}, (err,user)=>{
        console.log(err,user);
        if (err || !user){
            res.status(400).send({
                error:"User not found"
            });
        }

        //check user confirmed or not
        if(!user.verified){
            return res.status(400).send({
                error:"Please confirm your email"
            });
        }
        //check for password
        if(!user.authenticate(password)){
            return res.status(400).send({
                error:"Email and Password doesn't match"
            });
        }

        //generating JWT token
        const token = jwt.sign({_id : user._id},process.env.SECRET)
        //put in the cookie
        res.cookie("token",token,{expire: new Date() +9999})

        const {name, email, _id, role} = user;
        res.json({
            token,
            user:{
                name,
                email,
                _id,
                role
            }
        })
    })
}

exports.signout =(req,res) =>{
    res.clearCookie("token")
    return res.send({
        Msg: "You are successfully signout out..."
    });
}

exports.isSignedin = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: "auth"
})

exports.isAuthenticated =(req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(400).send({
            Error:"You are not authenticated BITCH"
        });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET,(err,verified)=>{
        if(err){
            return res.status(403).send({
                Error:"You are not authenticated BITCH"
            });
        }
        next();
    })
    
}

exports.isAdmin =(req,res,next) =>{

    if(req.body.role == 0){
        return res.status(402).send("You are not an Admin");      
    }
    next(); 
}

exports.verified= (req,res) =>{
    const {token} = req.body;
    if(token){
        jwt.verify(token,process.env.SECRET, (err,decoded)=>{
            if(err){
                return res.status(400).json({
                    err:"Incorrect or expired link"
                });
            }
            const {name,email} =decoded;
            console.log(email)
            User.findOne({email}, (err,user)=>{
                if(err){
                    return res.status(400).json({
                        err:"User not found"
                    });
                }
                user.verified = true;
                user.save((err,user)=>{
                    if(err){
                        return res.status(400).json({
                            err:"Unable to activate account  "
                        });
                    }
                    return res.status(200).json({ 
                        name : user.name,
                        email : user.email,
                        id : user._id,
                        verified:user.verified
                    });
                })
            })
        })
    }   
    else{
        return res.status(400).json({
            err:"Something went wrong......"
        });
    }
}