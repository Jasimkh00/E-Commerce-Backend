const Product = require("../../../Src/modules/product/Model");
const Order = require("../../../Src/modules/order/Model");
const User = require("../../../Src/modules/auth/Model");

const getAdminDashboardService = async () => {

    // ================= USERS =================
    const totalUsers = await User.countDocuments();

    const newUsersThisMonth = await User.countDocuments({
        createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
    });

    // ================= PRODUCTS =================
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });

    const lowStockProducts = await Product.countDocuments({
        totalStock: { $lte: 5, $gt: 0 }
    });

    const outOfStockProducts = await Product.countDocuments({
        totalStock: { $lte: 0 }
    });

    const products = await Product.find().select("totalStock variants");

    let totalStock = 0;
    let totalVariants = 0;

    products.forEach(p => {
        totalStock += p.totalStock || 0;
        totalVariants += (p.variants?.length || 0);
    });

    // ================= NON-CANCELLED ORDERS ONLY =================
    const validOrders = await Order.find({
        orderStatus: { $ne: "cancelled" }
    })
        .select("totalPrice createdAt orderItems profitCost")
        .lean();

    const totalOrders = validOrders.length;

    // ================= DATE SETUP =================
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const monthStart = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    );

    const todayOrders = validOrders.filter(o =>
        new Date(o.createdAt) >= todayStart &&
        new Date(o.createdAt) < tomorrow
    );

    const monthlyOrders = validOrders.filter(o =>
        new Date(o.createdAt) >= monthStart
    );

    // ================= SALES =================
    const totalRevenue = validOrders.reduce(
        (acc, o) => acc + (o.totalPrice || 0),
        0
    );

    const todayRevenue = todayOrders.reduce(
        (acc, o) => acc + (o.totalPrice || 0),
        0
    );

    const monthlyRevenue = monthlyOrders.reduce(
        (acc, o) => acc + (o.totalPrice || 0),
        0
    );

    // ================= PROFIT / LOSS =================
    const totalCost = validOrders.reduce(
        (acc, o) => acc + (o.profitCost || 0),
        0
    );

    const profit = totalRevenue - totalCost;
    const loss = profit < 0 ? Math.abs(profit) : 0;

    // ================= PRODUCT WISE ORDERS =================
    const productMap = {};

    validOrders.forEach(order => {
        order.orderItems?.forEach(item => {

            const product = item.productId;
            if (!product) return;

            const id = product._id?.toString();

            if (!productMap[id]) {
                productMap[id] = {
                    productId: id,
                    title: product.title,
                    totalOrders: 0,
                    revenue: 0
                };
            }

            productMap[id].totalOrders += 1;
            productMap[id].revenue += (item.price || 0) * (item.quantity || 0);
        });
    });

    const productWiseOrders = Object.values(productMap);

    // ================= FINAL RESPONSE (CLEAN ONLY) =================
    return {
        users: {
            totalUsers,
            newUsersThisMonth
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

        orders: {
            totalOrders,
            todayOrders: todayOrders.length,
            monthlyOrders: monthlyOrders.length
        },

        sales: {
            totalRevenue,
            todayRevenue,
            monthlyRevenue
        },

        finance: {
            profit,
            loss
        },

        productAnalytics: {
            productWiseOrders
        }
    };
};

module.exports = {
    getAdminDashboardService
};