const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrror =  require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apifeatures');
//Create product --admin
exports.createProduct = catchAsyncErrror(async(req,res,next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
});
// Get all products
exports.getAllProducts = catchAsyncErrror(async(req,res) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
     const apiFeatures = new ApiFeatures(Product.find(),req.query)
     .search()
     .filter().pagination(resultPerPage);
    const product = await apiFeatures.query;

    res.status(200).json({
        success:true,
        product
    })
});
//Get Product Details

exports.getProductDetails = catchAsyncErrror( async(req,res,next) => {
        const product = await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("Product not found", 404));
        }
        res.status(200).json({
            success:true,
            product,
            productCount
        })
    
});
//Update product-- admin
exports.updateProduct = catchAsyncErrror( async (req,res,next) => {
        let product = await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("Product not found", 404));
        }
        product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true, runValidators:true, useFindAndModify:false
        })
        res.status(200).json({
            success:true,
            product,
        })
 });
// Delete Product --Admin
exports.deleteProduct = catchAsyncErrror(async(req,res,next) => {
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
    await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    })
});