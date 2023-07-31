const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrror =  require('../middleware/catchAsyncError');

// Create New Order
exports.newOrder = catchAsyncErrror(async(req,res,next) => {
 const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
 const order = await Order.create({
    shippingInfo, 
    orderItems, 
    paymentInfo,
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice ,
    paidAt:Date.now(),
    user:req.user._id,
 });
   res.status(201).json({
    success:true,
    order,
   });
});

// Get Single Order Details
exports.getSingleOrder = catchAsyncErrror(async(req,res,next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if(!order){
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success:true,
    order,
  })
});

// Get Logged in user Order
exports.myOrders = catchAsyncErrror(async(req,res,next) => {
    const orders = await Order.find({user:req.user._id});
  
    res.status(200).json({
      success:true,
      orders,
    })
  });

  // Get All Orders ----ADMIN
exports.getAllOrders = catchAsyncErrror(async(req,res,next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });
    res.status(200).json({
      success:true,
      totalAmount,
      orders,
    })
  });

// Update Order Status --- ADMIN
  exports.updateOrder = catchAsyncErrror(async(req,res,next) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found with this Id", 404));
      }
    if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler("You have already delivered this order" ,400));
    }  
    order.orderItems.forEach( async(ord) => {
        await updateStock(ord.product,ord.quantity);
    });
    order.orderStatus = req.body.status;
    if(req.body.status === 'Delivered'){
        order.deliveredAt = Date.now();
    }

    await  order.save({validateBeforeSave: false})
    res.status(200).json({
      success:true,
     
    })
  });

  async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.Stock -= quantity;
    
    await  product.save({validateBeforeSave: false});
  };
// Delete orders --- ADMIN
  exports.deleteOrder = catchAsyncErrror(async(req,res,next) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found with this Id", 404));
      }
    await order.deleteOne();
    res.status(200).json({
      success:true,
      
    })
  });