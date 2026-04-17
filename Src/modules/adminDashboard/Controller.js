const adminDashboardService = require("../../../Src/modules/adminDashboard/AdminService");

const getAdminDashboard = async (req, res) => {
    try {
        console.log(" DASHBOARD CONTROLLER HIT");

        const data = await adminDashboardService.getAdminDashboardService();

        console.log(" RESPONSE DATA:", Object.keys(data));

        return res.status(200).json({
            message: "Admin dashboard analytics",
            data
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAdminDashboard
};