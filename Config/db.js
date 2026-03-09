// Require Mongoose :
const mongoose = require('mongoose');

// Function For Connect :
const ConnectDB = async () => {

    // Using Try-Catch :
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Mongo-DB Connected Successfully.');

    } catch (error) {
        console.log('Failed To Connect!');
        process.exit(1);
    }

};

// EXPORT MODULE :
module.exports = ConnectDB;