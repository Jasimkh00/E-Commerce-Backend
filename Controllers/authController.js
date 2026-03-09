const crypto = require('crypto');
const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const generateToken = require('../Utils/generateToken');


// Transporter To Send Emails (For Backend):
const transporter = nodemailer.createTransport({

    // To Connect Gmail To SMTP :
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

});

// Logic For Register User :
const register = async (req, res) => {

    // Using Try-Catch :
    try {

        // Get Data From Body :
        const { fullName, email, password, phone } = req.body;

        // Using If :
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check If User Already Exists :
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User Already Exists !' });
        }

        // Password Hashing :
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        // Register User In Mongo:
        const user = await User.create({
            fullName,
            email,
            password: hashPassword,
            phone
        });

        // Generate Token For User :
        const token = generateToken(user);

        // Make User Profile :
        const userProfile = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };

        // Response To User :
        res.status(201).json({
            message: 'User Registered Successfully .',
            data: {
                token,
                user: userProfile
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error !' });
    }
};

// Logic For User Login :
const login = async (req, res) => {

    // Using Try-Catch :
    try {

        // Get Data From Body :
        const { email, password } = req.body;

        // Using If :
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required.' });
        }

        // Find User By Email :
        const user = await User.findOne({ email });

        // Using If :
        if (!user) {
            return res.status(400).json({ message: 'User not found !' });
        }

        // Check IsActive By Using If  :
        if (!user.isActive) {
            return res.status(403).json({ message: 'User is blocked !' });
        }

        // Compare Password With Hash Password :
        const compare = await bcrypt.compare(password, user.password);

        // Using If :
        if (!compare) {
            return res.status(400).json({ message: 'Wrong Password !' });
        }

        // Generate Token :
        const token = await generateToken(user);

        // User Profile :
        const userProfile = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };

        // Response To User :
        res.status(200).json({
            message: 'User Login Successfully .',
            data: {
                token,
                userProfile
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error !' });
    }

};

// Logic For Get Profile :
const getProfile = async (req, res) => {

    res.status(200).json({
        message: 'Your Profile ',
        data: req.user,
    });

};


// Logic For Forget Password :
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token and save in DB
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save();

        // Create reset URL
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        // Send Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            text: `Click the link to reset your password: ${resetUrl}`,
        });

        res.status(200).json({
            status: 200,
            message: "Reset link sent to your email",
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};


// Logic For Reset Password :
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "Invalid or expired token",
            });
        }

        // Hash new password :
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            status: 200,
            message: "Password reset successfully .",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

// Logic For Get All Users (For Admin) :
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select(
            "-password -resetPasswordToken -resetPasswordExpire"
        );

        res.status(200).json({
            message: "All users fetched successfully",
            data: users,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


// Logic For Deactivate User :
const softDelete = async (req, res) => {

    // Using Try-Catch :
    try {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        // Using If :
        if (!user) {
            res.status(404).json({ message: 'User not found !' });
        };

        // If Found Then Response :
        res.status(200).json({ message: 'User deactivated successfully .' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error !' });
    }

};

// Logic For Delete User (For Admin) :
const deleteUserPermanent = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }

        // Response :
        res.status(200).json({
            status: 200,
            message: "User permanently deleted",
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};


// EXPORT MODULE :
module.exports = {
    register,
    login,
    getProfile,
    forgetPassword,
    resetPassword,
    getAllUsers,
    softDelete,
    deleteUserPermanent
};