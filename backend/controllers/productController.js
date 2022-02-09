const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

//Create product
exports.createProduct = catchAsyncErrors(async(req, res, next) => {

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
});


//Get all products
exports.getAllProducts = catchAsyncErrors(async(req,res,next) => {
    
    // return next(new ErrorHander("This is an error",500));

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(),req.query)
        .search()
        .filter()

        let products = await apiFeature.query;

  let filteredProductsCount = products.length;
        apiFeature.pagination(resultPerPage);

   products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    });
});

//Get product details
exports.getProductDetails = catchAsyncErrors( async(req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("Product not found",404));
    }
    res.status(200).json({
        success: true,
        product,
    });  
});

//Update product -- Admin

exports.updateProduct = catchAsyncErrors(async(req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("Product not found",500));
    }
    // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators : true,
        useFindAndModify : false
    });
    res.status(200).json({
        success : true,
        product
    });
});

//Delete product -- Admin

exports.deleteProduct = catchAsyncErrors(async(req, res, next) =>{
    let product = await Product.findById(req.params.id);
    console.log(product);
    if(!product){
        return next(new ErrorHander("Product not found",500));
    }

    // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

    await product.remove();

    res.status(200).json({
        success : true,
        message : "Product deleted successfully",
    });
});

//Get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async(req,res,next) =>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));
    }
    res.status(200).json({
        success : true,
        reviews : product.reviews,
    });
});

//Delete a reviews
exports.deleteReview = catchAsyncErrors(async(req, res,next) =>{
    const product = await Product.findById(req.query.productId);
    // console.log(product);
    if(!product){
        return next(new ErrorHander("Product not found",404));
    }

    const reviews = product.reviews.filter( rev => rev._id.toString() != req.query.id.toString());
    product.reviews.forEach(rev => {console.log(rev._id.toString())});
    console.log(req.query.id.toString());
    let avg = 0;
    if(reviews)reviews.forEach(rev => {
        avg += rev.rating;
    });
    let rating = avg / reviews.length;
    const numOfReviews = reviews.length;
    if(reviews.length==0){
        rating = 0;
    }
    await Product.findByIdAndUpdate(req.query.productId,{reviews,rating,numOfReviews},{
        new:true,
        runValidators : true,
        useFindAndModify : false
    });


    res.status(200).json({
        success : true,
        message : "review deleted",
    });
});

//Get all products (Admin)
exports.getAdminProducts = catchAsyncErrors(async(req,res,next) => {
    
  const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});