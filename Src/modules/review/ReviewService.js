// Require Models :
const Review = require("../../../Src/modules/review/Model");
const Product = require("../../../Src/modules/product/Model");

// Logic For Add Review :
const addReviewService = async (userId, body) => {

  const { productId, rating, comment } = body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Checking For Already Reviewed :
  const alreadyReviewed = await Review.findOne({
    userId,
    productId
  });

  if (alreadyReviewed) {
    throw new Error("You already reviewed this product");
  }

  // Create Review
  const review = await Review.create({
    userId,
    productId,
    rating,
    comment
  });

  // Recalculate Rating
  const reviews = await Review.find({ productId });

  const totalReviews = reviews.length;

  const averageRating =
    reviews.reduce((acc, item) => acc + item.rating, 0) / totalReviews;

  await Product.findByIdAndUpdate(productId, {
    totalReviews,
    averageRating
  });

  return review;
};



// Logoc For Get Product Review :
const getProductReviewsService = async (productId) => {

  const reviews = await Review
    .find({ productId })
    .populate("userId", "fullName");

  return reviews;
};


// Logic For Delete Review :
const deleteReviewService = async (reviewId, user) => {

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // Only owner can delete
  if (review.userId.toString() !== user._id.toString()) {
    throw new Error("You are not allowed to delete reviews.");
  }

  await review.deleteOne();

  // Recalculate Rating
  const reviews = await Review.find({ productId: review.productId });

  const totalReviews = reviews.length;

  let averageRating = 0;

  if (totalReviews > 0) {
    averageRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / totalReviews;
  }

  await Product.findByIdAndUpdate(review.productId, {
    totalReviews,
    averageRating
  });

  return true;
};

// Export Module :
module.exports = {
  addReviewService,
  getProductReviewsService,
  deleteReviewService
};