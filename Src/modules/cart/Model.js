// Require Mongoose :
const mongoose = require("mongoose");

//  Nested Schema Is Used In This File :


// Function For Cart Item Schema :
const cartItemSchema = new mongoose.Schema(
{
  productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true
  },

  variantId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },

  qty:{
    type:Number,
    required:true,
    min:1
  },

  priceSnapshot:{
    type:Number,
    required:true
  },

  titleSnapshot:{
    type:String,
    required:true
  },

  imageSnapshot:{
    type:String
  }

},

{_id:true}

);

// Function For Cart Model :
const cartSchema = new mongoose.Schema(
{
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    unique:true
  },

  items:{
    type:[cartItemSchema],
    default:[]
  }

},

{timestamps:true}

);

// Export Module :
module.exports = mongoose.model("Cart",cartSchema);