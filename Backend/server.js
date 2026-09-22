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

require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

module.exports = app