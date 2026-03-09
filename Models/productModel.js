const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountType: {
      type: String,
      enum: ["percent", "flat"],
      default: null,
    },

    discountValue: {
      type: Number,
      default: 0,
    },

    finalPrice: {
      type: Number,
    },

    stockTotal: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    tags: [String],
    images: [String],
  },
  { timestamps: true }
);


// ✅ PRE SAVE HOOK (NO NEXT ISSUE)
productSchema.pre("save", function () {

  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.discountType === "percent") {
    this.finalPrice = this.price - (this.price * this.discountValue) / 100;
  } 
  else if (this.discountType === "flat") {
    this.finalPrice = this.price - this.discountValue;
  } 
  else {
    this.finalPrice = this.price;
  }

  if (this.finalPrice < 0) {
    this.finalPrice = 0;
  }

});

module.exports = mongoose.model("Product", productSchema);