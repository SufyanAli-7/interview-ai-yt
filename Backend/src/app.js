// Polyfill browser globals required by pdfjs-dist / pdf-parse in Node.js serverless
if (typeof global.DOMMatrix === "undefined") {
    global.DOMMatrix = class DOMMatrix {};
}
if (typeof global.ImageData === "undefined") {
    global.ImageData = class ImageData {};
}
if (typeof global.Path2D === "undefined") {
    global.Path2D = class Path2D {};
}

const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || process.env.NODE_ENV === "production") {
            return callback(null, true)
        }
        return callback(null, true)
    },
    credentials: true
}))

const connectToDB = require("./config/database")

// Ensure MongoDB is connected before handling API requests
app.use(async (req, res, next) => {
    try {
        await connectToDB()
        next()
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Database connection error."
        })
    }
})

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Global Server Error:", err)
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    })
})

module.exports = app