const mongoose = require("mongoose")



let isConnected = false

async function connectToDB() {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined. Please add MONGO_URI in your Vercel Project Settings -> Environment Variables.")
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        })
        isConnected = true
        console.log("Connected to Database")
    }
    catch (err) {
        console.log("Database connection error:", err)
        throw new Error(`Database connection failed: ${err.message}. Please check MongoDB Atlas Network Access (allow 0.0.0.0/0).`)
    }
}

module.exports = connectToDB