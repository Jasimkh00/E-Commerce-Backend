// Require Mongoose :
const mongoose = require("mongoose");

// Nested Schema Is Used In This File :

// Function For Order Item Schema :
const orderItemSchema = new mongoose.Schema({

 productId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Product",
  required:true
 },

 variantId:{
  type:mongoose.Schema.Types.ObjectId,
  required:true
 },

 titleSnapshot:{
  type:String,
  required:true
 },

 priceSnapshot:{
  type:Number,
  required:true
 },

 imageSnapshot:String,

 qty:{
  type:Number,
  required:true,
  min:1
 }

},

{_id:false}

);  


// Function For Order Model :
const orderSchema = new mongoose.Schema({

 orderNumber:{
  type:String,
  unique:true
 },

 userId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 items:[orderItemSchema],

 subtotal:{
  type:Number,
  required:true
 },

 status:{
  type:String,
  enum:[
   "pending",
   "confirmed",
   "shipped",
   "delivered",
   "cancelled"
  ],
  default:"pending"
 },

 shippingAddress:{
  type:String,
  required:true
 },

 paymentMethod:{
  type:String,
  enum:["Cash On Delivery"],
  default:"Cash On Delivery"
 }

},

{timestamps:true}

);

// Export Module :
module.exports = mongoose.model("Order",orderSchema);