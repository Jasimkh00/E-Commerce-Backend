// Require Express , Dotenv And Config :
const express = require('express');

const dotenv = require('dotenv');

const ConnectDB = require('./Src/Config/db');

//  Transfer Data From Env :
dotenv.config();

// For Connecting Mongo-DB :
ConnectDB();

// Create Server :
const app = express();

// Middleware For Json (Used To Convert Json String Into Js Object) :
app.use(express.json());


// Import Routes :
const userRoutes = require('./Src/modules/auth/Routes');
const categoryRoutes = require('./Src/modules/category/Routes');
const productRoutes = require('./Src/modules/product/Routes');
const cartRoutes = require('./Src/modules/cart/Routes');
const orderRoutes = require('./Src/modules/order/Routes');
const reviewRoutes = require('./Src/modules/review/Routes');
const saleRoutes = require('./Src/modules/sale/Routes');
const wishListRoutes = require('./Src/modules/wishList/Routes');
const inventoryRoutes = require('./Src/modules/inventory/Routes');
const adminDashboardRoutes = require('./Src/modules/adminDashboard/Routes');
const sliderRoutes = require("./Src/modules/slider/Routes");



// Mount Routes :
app.use('/api/User',userRoutes);
app.use('/api/Category',categoryRoutes);
app.use('/api/Product',productRoutes);
app.use('/api/Cart',cartRoutes);
app.use('/api/Order',orderRoutes);
app.use('/api/review',reviewRoutes);
app.use('/api/sale',saleRoutes);
app.use('/api/wishList',wishListRoutes);
app.use('/api/inventory',inventoryRoutes);
app.use('/api/adminDashboard',adminDashboardRoutes);
app.use('/api/slider',sliderRoutes);


// Select Port :
const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

