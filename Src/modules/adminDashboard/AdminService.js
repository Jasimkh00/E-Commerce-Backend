// Require Models :
const Product = require("../../../Src/modules/product/Model");
const Order = require("../../../Src/modules/order/Model");
const User = require("../../../Src/modules/auth/Model");

// Logic For Admin Dashboard :
const getAdminDashboardService = async () => {

    //FOR  USERS :
    const totalUsers = await User.countDocuments();

    const newUsersThisMonth = await User.countDocuments({
        createdAt: {
            $gte: new Date(new Date().setDate(1))
        }
    });

    //FOR PRODUCTS :
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

    //FOR INVENTORY :
    const products = await Product.find();

    let totalStock = 0;
    let totalVariants = 0;

    products.forEach(product => {
        totalStock += product.totalStock;

        product.variants.forEach(() => {
            totalVariants++;
        });
    });

    //FOR ORDERS :
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

    //FOR SALES :
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

    //FOR PERFORMANCE :
    const bestSellingProducts = await Product
        .find({ isActive: true })
        .sort("-totalSold")
        .limit(5)
        .select("title totalSold images");

    const topRatedProducts = await Product
        .find({ isActive: true })
        .sort("-averageRating")
        .limit(5)
        .select("title averageRating images");

    const newArrivals = await Product
        .find({ isActive: true, isNewArrival: true })
        .sort("-createdAt")
        .limit(5)
        .select("title images createdAt");

    return {
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
    };
};

// EXPORT
module.exports = {
    getAdminDashboardService
};