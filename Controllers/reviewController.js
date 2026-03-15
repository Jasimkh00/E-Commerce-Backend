// Require Models :
const Review = require("../Models/reviewModel");
const Product = require("../Models/productModel");

// Logic For Add Review :
const addReview = async(req,res)=>{

  // Using Try-Catch :
try{

 // Get Data From Body :
 const {productId,rating,comment} = req.body

const product = await Product.findById(productId)

if(!product){
 return res.status(404).json({
  message:"Product not found"
 });
}

// For Already Reviewed :
 const alreadyReviewed = await Review.findOne({
  userId:req.user._id,
  productId
 });

//  Using If :
 if(alreadyReviewed){
  return res.status(400).json({
   message:"You already reviewed this product"
  });
 };

//  Create Review :
 const review = await Review.create({
  userId:req.user._id,
  productId,
  rating,
  comment
 });

 const reviews = await Review.find({productId})

 const totalReviews = reviews.length

 const averageRating =
  reviews.reduce((acc,item)=>item.rating+acc,0) / totalReviews

 await Product.findByIdAndUpdate(productId,{
  totalReviews,
  averageRating
 });

//  Response :
 res.status(201).json({
  message:"Review added",
  data:review
 });

}catch(error){
 res.status(500).json({message:error.message});
}
};

// Logic for Get Product Reviews :
const getProductReviews = async(req,res)=>{

  // Using Try-Catch :
try{

  // Find Reviews :
 const reviews = await Review
 .find({productId:req.params.productId})
 .populate("userId","fullName")

//  Response :
 res.status(200).json({
  message:"Product reviews fetched",
  data:reviews
 });

}catch(error){
 res.status(500).json({message:error.message});
}
};

// Logic fOr Delete Review :
const deleteReview = async(req,res)=>{

  // Using Try-Catch :
try{

 const review = await Review.findById(req.params.id)

//  using If :
 if(!review){
  return res.status(404).json({
   message:"Review not found"
  });
 }

// Check (Only Users Who have Given Review) :
 if(review.userId.toString() !== req.user._id.toString()){
  return res.status(403).json({
   message:"You are not allowed to delete reviews."
  });
 }

//  Delete Review :
await review.deleteOne()

const reviews = await Review.find({productId:review.productId})

const totalReviews = reviews.length

let averageRating = 0

if(totalReviews > 0){
 averageRating =
  reviews.reduce((acc,item)=> acc + item.rating,0) / totalReviews
};

await Product.findByIdAndUpdate(review.productId,{
 totalReviews,
 averageRating
});

// Response :
res.status(200).json({
 message:"Review deleted"
});

}catch(error){
 res.status(500).json({message:error.message});
}
};

// EXPORT MODULES :
module.exports = {
 addReview,
 getProductReviews,
 deleteReview
};