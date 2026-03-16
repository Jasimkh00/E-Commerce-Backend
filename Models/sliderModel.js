// Require Mongoose :
const mongoose = require("mongoose");

// Function For Slider Model :
const sliderSchema = new mongoose.Schema({

 title:{
  type:String,
  required:true
 },

 subtitle:{
  type:String
 },

 image:{
  type:String,
  required:true
 },

 buttonText:{
  type:String
 },

 buttonLink:{
  type:String
 },

 order:{
  type:Number,
  default:1
 },

 isActive:{
  type:Boolean,
  default:true
 }

},{timestamps:true});

// Export Module :
module.exports = mongoose.model("Slider",sliderSchema);