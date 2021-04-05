const mongoose = require('mongoose');
require('dotenv').config()
var bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express');
const app = express();



//import route files
const authRoutes = require("./Routes/auth");
const userRoutes = require("./Routes/user");
const categoryRoutes = require("./Routes/category")
const productRoutes = require("./Routes/product")
const orderRoutes = require("./Routes/order")

 
const db = process.env.DATABASE 
const c_s = process.env.CONNECTION_STRING
//db connection
mongoose.connect(db,{
    useNewUrlParser : true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() =>{
    console.log("DB CONNECTED....");
}).catch((err) =>{ 
    console.log("FAILED.....",err);
});


//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());

//routes
app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)
app.use("/api",orderRoutes)

// port and listening
const PORT = process.env.PORT || 8000;
app.listen(PORT,() =>{
    console.log("Server is UP>......",PORT)
})
