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

app.get("/", (req, res) => {
  res.send("API Working Successfully");
});
// Import Routes :
const userRoutes = require('./Routes/userRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const productRoutes = require('./Routes/productRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const orderRoutes = require('./Routes/orderRoutes');



// Mount Routes :
app.use('/api/User',userRoutes);
app.use('/api/Category',categoryRoutes);
app.use('/api/Product',productRoutes);
app.use('/api/Cart',cartRoutes);
app.use('/api/Order',orderRoutes);


// Select Port :
const PORT = process.env.PORT || 3000;

// Making Server :
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});

