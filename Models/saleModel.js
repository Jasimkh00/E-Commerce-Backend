// Require Mongoose :
const mongoose = require("mongoose");

// Function For Sale Model :
const saleSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    discountPercentage: {
        type: Number,
        required: true
    },

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }

},
    { timestamps: true }

);

// Export Module :
module.exports = mongoose.model("Sale", saleSchema);