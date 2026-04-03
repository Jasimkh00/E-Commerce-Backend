// Require Mongoose :
const mongoose = require("mongoose");

// Function For WishList Model :
const wishlistSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]

},

    // Add TimeStamps :
    { timestamps: true }

);

// Export Module :
module.exports = mongoose.model("Wishlist", wishlistSchema);