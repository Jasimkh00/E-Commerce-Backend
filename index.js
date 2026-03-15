// Require Express , Dotenv And Config :
const express = require('express');

const dotenv = require('dotenv');

const ConnectDB = require('./Config/db');

//  Transfer Data From Env :
dotenv.config();

// Call Function :
ConnectDB();

// Variable For Express :
const app = express();

// Middleware For Json (Used To Convert Json String Into Js Object) :
app.use(express.json());


// Import Routes :
const userRoutes = require('./Routes/userRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const productRoutes = require('./Routes/productRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const reviewRoutes = require('./Routes/reviewRoutes');
const saleRoutes = require('./Routes/saleRoutes');
const wishListRoutes = require('./Routes/wishListRoutes');
const inventoryRoutes = require('./Routes/inventoryRoutes');
const adminDashboardRoutes = require('./Routes/adminDashboardRoutes');



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


// Select Port :
const PORT = process.env.PORT 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

