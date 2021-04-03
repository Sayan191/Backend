var express = require("express")
var router = express.Router()

const { getProductById,
        createProduct,
        getProduct,
        photo,
        updateProduct,
        deleteProduct,
        getAllProduct,
        getAllUniqueProducts } = require("../Controllers/product")
const { isAdmin,isAuthenticated,isSignedin } = require("../Controllers/auth")
const { getUserById } = require("../Controllers/user")

router.param("userId", getUserById)
router.param("productId", getProductById)

router.post("/create/product/:userId", isSignedin, isAuthenticated, isAdmin, createProduct)
router.get("/products", getAllProduct)

//listing routes
router.get("/product/:productId",getProduct)
router.get("/product/photo/:productId", photo)
router.get("/products/categories", getAllUniqueProducts)

router.put("/manage/:productId/:userId",isSignedin, isAuthenticated, updateProduct)
router.delete("/delete/:productId/:userId",isSignedin, isAuthenticated, deleteProduct)

module.exports = router