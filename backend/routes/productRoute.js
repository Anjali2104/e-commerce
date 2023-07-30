const express = require('express');
const { getAllProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct,
     getProductDetails, 
     createProductReview, 
     getProductReviews,
     deleteReview} = require('../controllers/productController');
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');
const router = express.Router();

router.route("/products").get( getAllProducts);
router.route("/admin/product/new").post( isAuthenticatedUser, authorizedRoles("admin"),createProduct);
router.route("/admin/product/:id").put( isAuthenticatedUser , authorizedRoles("admin"),updateProduct);
router.route("/admin/product/:id").delete(isAuthenticatedUser , authorizedRoles("admin") ,deleteProduct);
// or router.route("/product/:id").put(updateProduct).delete(deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getProductReviews).delete( isAuthenticatedUser, deleteReview)

module.exports=router;