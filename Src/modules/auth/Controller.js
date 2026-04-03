// Require Auth Service :
const authService = require("../../../Src/modules/auth/AuthService");
//  For REGISTER :
const register = async (req, res) => {
    try {
        const data = await authService.registerUser(req.body);

        res.status(201).json({
            message: "User Registered Successfully",
            data
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// For LOGIN :
const login = async (req, res) => {
    try {
        const data = await authService.loginUser(req.body);

        res.status(200).json({
            message: "User Login Successfully",
            data
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// For GET PROFILE :
const getProfile = async (req, res) => {
    try {
        const data = await authService.getUserProfile(req.user);

        res.status(200).json({
            message: "Your Profile",
            data
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// For FORGOT PASSWORD :
const forgetPassword = async (req, res) => {
    try {
        const message = await authService.forgotPasswordService(req.body.email);

        res.status(200).json({ message });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// For RESET PASSWORD :
const resetPassword = async (req, res) => {
    try {
        const message = await authService.resetPasswordService(
            req.params.token,
            req.body.password
        );

        res.status(200).json({ message });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// For GET ALL USERS :
const getAllUsers = async (req, res) => {
    try {
        const users = await authService.getAllUsersService();

        res.status(200).json({
            message: "All users fetched successfully",
            data: users
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// For SOFT DELETE :
const softDelete = async (req, res) => {
    try {
        await authService.softDeleteUser(req.params.id);

        res.status(200).json({
            message: "User deactivated successfully"
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// For DELETE PERMANENT :
const deleteUserPermanent = async (req, res) => {
    try {
        await authService.deleteUserPermanentService(req.params.id);

        res.status(200).json({
            message: "User permanently deleted"
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Export Modules :
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