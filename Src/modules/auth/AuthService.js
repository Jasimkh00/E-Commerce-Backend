const crypto = require('crypto');
const User = require('../../../Src/modules/auth/Model');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const generateToken = require('../../../Src/Utils/generateToken');

// Profile Models
const Order = require('../../../Src/modules/order/Model');
const Review = require('../../../Src/modules/review/Model');
const Wishlist = require('../../../Src/modules/wishList/Model');

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

// Logic For  REGISTER :
 const registerUser = async (body) => {

    const { fullName, email, password, phone, role } = body;

    if (!fullName || !email || !password) {
        throw new Error('All fields are required.');
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error('User Already Exists !');
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        fullName,
        email,
        password: hashPassword,
        phone,
        role
    });

    const token = generateToken(user);

    return {
        token,
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        }
    };
};


// Logic For LOGIN :
const loginUser = async (body) => {

    const { email, password } = body;

    if (!email || !password) {
        throw new Error('Email and Password are required.');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('User not found !');
    }

    if (!user.isActive) {
        throw new Error('User is blocked !');
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
        throw new Error('Wrong Password !');
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        }
    };
};


// Logic For GET PROFILE :
const getUserProfile = async (user) => {

    const userId = user._id;

    const orders = await Order.find({ userId })
        .populate("items.productId", "title");

    const wishlist = await Wishlist.findOne({ userId })
        .populate("products", "title images");

    const reviews = await Review.find({ userId })
        .populate("productId", "title");

    return {
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        },
        orders,
        wishlist,
        reviews
    };
};


// Logic For FORGET PASSWORD :
const forgotPasswordService = async (email) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Request",
        text: `Click the link to reset your password: ${resetUrl}`,
    });

    return "Reset link sent to your email";
};


// Logic For RESET PASSWORD :
const resetPasswordService = async (token, password) => {

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        throw new Error("Invalid or expired token");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return "Password reset successfully";
};


// Logic For GET ALL USERS :
const getAllUsersService = async () => {

    return await User.find().select(
        "-password -resetPasswordToken -resetPasswordExpire"
    );
};


// Logic For SOFT DELETE :
const softDeleteUser = async (id) => {

    const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );

    if (!user) {
        throw new Error("User not found !");
    }

    return;
};


// Logic For DELETE PERMANENT :
const deleteUserPermanentService = async (id) => {

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw new Error("User not found");
    }

    return;
};


// Export Modules :
module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    forgotPasswordService,
    resetPasswordService,
    getAllUsersService,
    softDeleteUser,
    deleteUserPermanentService
};