const getAdminDashboardService = async () => {

    // USERS
    const totalUsers = await User.countDocuments();

    const newUsersThisMonth = await User.countDocuments({
        createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
    });

    const users = {
        totalUsers,
        newUsersThisMonth
    };

    // PRODUCTS
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });

    const products = {
        totalProducts,
        activeProducts
    };

    // ORDERS
    const validOrders = await Order.find({ orderStatus: { $ne: "cancelled" } }).lean();

    const orders = {
        totalOrders: validOrders.length
    };

    // FINAL RETURN
    return {
        users,
        products,
        orders
    };
};