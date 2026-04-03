// Require Admin Dashboard Service :
const adminDashboardService = require("../../../Src/modules/adminDashboard/AdminService");

// For Admin Dashboard :
const getAdminDashboard = async (req, res) => {
    try {

        const data = await adminDashboardService.getAdminDashboardService();

        res.status(200).json({
            message: "Admin dashboard analytics",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// EXPORT
module.exports = {
    getAdminDashboard
};