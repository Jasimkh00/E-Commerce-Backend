const mongoose = require('mongoose');
const slugify = require('slugify');

//  Function :
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    slug: {
      type: String,
      unique: true
    },

    isActive: {
      type: Boolean,
      default: true
    }

  },
  { timestamps: true }
);

//  Mongoose Pre Save Hook To Generate Slug :
categorySchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
});

module.exports = mongoose.model("Category", categorySchema);


