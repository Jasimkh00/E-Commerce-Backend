// Require Product , Order And User Model :
const Product = require("../Models/productModel");
const Order = require("../Models/orderModel");
const User = require("../Models/userModel");

// Logic For Get Admin Dashboard :
const getAdminDashboard = async (req, res) => {

    // Using Try-Catch :
    try {

        // For Users :
        const totalUsers = await User.countDocuments();

        // For New Users :
        const newUsersThisMonth = await User.countDocuments({
            createdAt: {
                $gte: new Date(new Date().setDate(1))
            }
        });

        // For Products :
        const totalProducts = await Product.countDocuments();

        const activeProducts = await Product.countDocuments({
            isActive: true
        });

        const outOfStockProducts = await Product.countDocuments({
            totalStock: 0
        });

        const lowStockProducts = await Product.countDocuments({
            totalStock: { $lte: 5, $gt: 0 }
        });

        // For Inventory :
        const products = await Product.find();

        let totalStock = 0;
        let totalVariants = 0;

        products.forEach(product => {

            totalStock += product.totalStock;

            product.variants.forEach(v => {
                totalVariants++;
            });

        });

        // For Orders :
        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "pending"
        });

        const deliveredOrders = await Order.countDocuments({
            orderStatus: "delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            orderStatus: "cancelled"
        });

        // For Sales :
        const orders = await Order.find();

        const totalRevenue = orders.reduce(
            (acc, item) => acc + item.totalPrice,
            0
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrders = await Order.find({
            createdAt: { $gte: today }
        });

        const todaySales = todayOrders.reduce(
            (acc, item) => acc + item.totalPrice,
            0
        );

        const firstDayMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );

        const monthOrders = await Order.find({
            createdAt: { $gte: firstDayMonth }
        });

        const monthlySales = monthOrders.reduce(
            (acc, item) => acc + item.totalPrice,
            0
        );

        // For Best Selling Products :
        const bestSellingProducts = await Product
            .find({ isActive: true })
            .sort("-totalSold")
            .limit(5)
            .select("title totalSold images");

        // For Top Rated Products :
        const topRatedProducts = await Product
            .find({ isActive: true })
            .sort("-averageRating")
            .limit(5)
            .select("title averageRating images");

        // For New Arrivals :
        const newArrivals = await Product
            .find({ isActive: true, isNewArrival: true })
            .sort("-createdAt")
            .limit(5)
            .select("title images createdAt");

        res.status(200).json({
            message: "Admin dashboard analytics",
            data: {

                users: {
                    totalUsers,
                    newUsersThisMonth
                },

                orders: {
                    totalOrders,
                    pendingOrders,
                    deliveredOrders,
                    cancelledOrders
                },

                sales: {
                    totalRevenue,
                    todaySales,
                    monthlySales
                },

                products: {
                    totalProducts,
                    activeProducts,
                    lowStockProducts,
                    outOfStockProducts
                },

                inventory: {
                    totalStock,
                    totalVariants
                },

                performance: {
                    bestSellingProducts,
                    topRatedProducts,
                    newArrivals
                }

            }

        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// EXPORT MODULE :
module.exports = {
    getAdminDashboard
};