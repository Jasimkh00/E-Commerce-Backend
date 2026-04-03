// Require Review Service :
const reviewService = require("../../../Src/modules/review/ReviewService");

// ADD REVIEW
const addReview = async (req, res) => {
  try {
    const review = await reviewService.addReviewService(
      req.user._id,
      req.body
    );

    res.status(201).json({
      message: "Review added",
      data: review
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET REVIEWS
const getProductReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getProductReviewsService(
      req.params.productId
    );

    res.status(200).json({
      message: "Product reviews fetched",
      data: reviews
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReviewService(
      req.params.id,
      req.user
    );

    res.status(200).json({
      message: "Review deleted"
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Export Module :
module.exports = {
  addReview,
  getProductReviews,
  deleteReview
};