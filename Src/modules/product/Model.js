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
productSchema.pre("save", async function () {

  
  // SLUG GENERATION (CATEGORY STYLE)
  
  if (this.isModified("title") && this.title) {

    let slug = slugify(this.title, { lower: true, strict: true });

    const Product = mongoose.model("Product");

    let existing = await Product.findOne({
      slug,
      _id: { $ne: this._id }
    });

    if (existing) {
      slug = slug + "-" + Date.now();
    }

    this.slug = slug;
  }

  
  // VARIANT PRICE And STOCK CALCULATION
  
  if (Array.isArray(this.variants) && this.variants.length > 0) {

    let totalStock = 0;

    for (let i = 0; i < this.variants.length; i++) {

      let variant = this.variants[i];

      const price = Number(variant.price) || 0;
      const discountValue = Number(variant.discountValue) || 0;
      const stock = Number(variant.stock) || 0;

      let finalPrice = price;

      if (variant.discountType === "percent") {
        finalPrice = price - (price * discountValue / 100);
      }

      else if (variant.discountType === "flat") {
        finalPrice = price - discountValue;
      }

      if (finalPrice < 0) finalPrice = 0;

      // update variant
      this.variants[i].finalPrice = finalPrice;

      totalStock += stock;
    }

    this.totalStock = totalStock;
  }

});

// Export Module :
module.exports = mongoose.model("Product", productSchema);