// Require Mongoose And Slugify :
const mongoose = require("mongoose");
const slugify = require("slugify");

// Fuction For Category Model :
const categorySchema = new mongoose.Schema(
  {
    // For  Name :
    name: {
      type: String,
      required: true,
      trim: true
    },

    // For Slug :
    slug: {
      type: String,
      unique: true
    },

    // For Child Category :
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },

    // For isActive :
    isActive: {
      type: Boolean,
      default: true
    }

  },

  { timestamps: true }
  
);


// Pre Save Hook For Generate Slug With Parent Category :
categorySchema.pre("save", async function () {

  if (this.isModified("name")) {

    let slug = slugify(this.name, { lower: true, strict: true })

    const Category = mongoose.model("Category")

    let existing = await Category.findOne({
      slug,
      _id: { $ne: this._id }
    });

    if (existing) {
      slug = slug + "-" + Date.now()
    }

    if (this.parentCategory) {

      const parent = await Category.findById(this.parentCategory)

      if (parent) {
        slug = `${parent.slug}-${slug}`
      }

    }

    this.slug = slug
  }

  

});
module.exports = mongoose.model("Category", categorySchema)