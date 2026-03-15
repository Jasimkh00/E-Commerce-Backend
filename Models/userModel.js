// Require Mongoose :
const mongoose = require("mongoose");

// Function For User Model :
const userSchema = new mongoose.Schema(
  {
    // For Full Name :
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    // For Email :
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter vaild email.'
      ],
    },

    // For Password : 
    password: {
      type: String,
      required: true,
    },
    // For Phone:
    phone: String,

    // For Role :
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },

    // For IsActive :
    isActive: {
      type: Boolean,
      default: true,
    },

    // Fields For Forget Password :
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },

  //   Add Time Stamps :
  { timestamps: true }

);

// Export Module :
module.exports = mongoose.model("User", userSchema);