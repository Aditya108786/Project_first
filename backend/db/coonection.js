//
const mongoose = require('mongoose');
const DB_NAME = require('../constant');
console.log(process.env.MONGODB_URI);
const connectdb = async () => {
    try {
        // Try to connect to MongoDB
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Connected to the database");
    } catch (error) {
        // Log the error message for better troubleshooting
        console.log("Error connecting to the database:", error.message);
    }
};

module.exports = connectdb;