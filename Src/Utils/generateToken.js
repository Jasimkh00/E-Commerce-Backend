// Require  JWT :
const jwt = require('jsonwebtoken');

// Function :
const generateToken = (user) => {

    // Using Return :
    return jwt.sign(

        // Get User Id And Role :
        {
            id: user._id,
            role: user.role
        },

        // Add Secret Key From Env :
        process.env.JWT_SECRET,

        // Add Expiry Date :
        { expiresIn: process.env.JWT_EXPIRES }

    );

};

// EXPORT MODULE :
module.exports = generateToken;
