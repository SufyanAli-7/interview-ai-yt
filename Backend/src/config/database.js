const mongoose = require("mongoose")



let isConnected = false

async function connectToDB() {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return
    }

    try {
        await mongoose.connect(process.env.MONGO_URI)
        isConnected = true
        console.log("Connected to Database")
    }
    catch (err) {
        console.log("Database connection error:", err)
    }
}

module.exports = connectToDB