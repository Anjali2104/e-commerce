const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrror =  require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apifeatures');
//Create product --admin
exports.createProduct = catchAsyncErrror(async(req,res,next) => {
    req.body.user = req.user.id;
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
 // Create new Review or update the review
 exports.createProductReview = catchAsyncErrror(async(req,res,next) => {
    const {rating ,comment,productId} = req.body;
    const review = {
        user: req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    };
    const product = await Product.findById(productId);
    const isReviewwd = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());
    
    if(isReviewwd){
      product.reviews.forEach((rev) => {
        if(rev.user.toString() === req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment)
        
      });
    }
    else{
       product.reviews.push(review);
       product.numOfReviews = product.reviews.length;
    }
    let averageRating = 0 ;
     product.reviews.forEach((rev) => {
        averageRating+=rev.rating
    });
    product.ratings = averageRating/product.reviews.length;
    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
    })
 });
 // Get all Reviews
 exports.getProductReviews = catchAsyncErrror(async(req,res,next) => {
    const product = await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews,
    })
 })
 // Delete Review
 exports.deleteReview = catchAsyncErrror(async(req,res,next) => {
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());
    let averageRating = 0 ;
    reviews.forEach((rev) => {
        averageRating+=rev.rating
    });
    
  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = averageRating / reviews.length;
  }

    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews,
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    }
    );
    res.status(200).json({
        success:true,
        
    })
 })