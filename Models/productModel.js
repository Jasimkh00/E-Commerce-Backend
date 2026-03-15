// Require Mongoose And Slugify :
const mongoose = require("mongoose");
const slugify = require("slugify");

// Using Nested Schema In This File  :

// Functon For Variant Schema :
const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      trim: true
    },

    size: {
      type: String,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discountType: {
      type: String,
      enum: ["percent", "flat", null],
      default: null
    },

    discountValue: {
      type: Number,
      default: 0
    },

    finalPrice: {
      type: Number
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    }

  },

  { _id: true }

);


//  Function For Product Model :
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true
    },

    description: {
      type: String
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    images: [
      {
        type: String
      }
    ],

    variants: [variantSchema],

    tags: [
      {
        type: String
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    },

    isNewArrival: {
      type: Boolean,
      default: false
    },

    totalStock: {
      type: Number,
      default: 0
    },

    totalSold: {
      type: Number,
      default: 0
    },

    lowStockAlert: {
      type: Number,
      default: 5
    },

    averageRating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    },

  },

  { timestamps: true}

);


// Pre Save Hook (Middleware) :
productSchema.pre("save", function (next) {

  // Slug Generate :
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Variant Price Calculation :
  if (this.variants && this.variants.length > 0) {

    this.variants.forEach(variant => {

      if (variant.discountType === "percent") {

        variant.finalPrice =
          variant.price - (variant.price * variant.discountValue / 100);

      }

      else if (variant.discountType === "flat") {

        variant.finalPrice =
          variant.price - variant.discountValue;

      }

      else {

        variant.finalPrice = variant.price;

      }

      if (variant.finalPrice < 0) {
        variant.finalPrice = 0;
      }

    });

  }

  next();

});

// Export Module :
module.exports = mongoose.model("Product", productSchema);