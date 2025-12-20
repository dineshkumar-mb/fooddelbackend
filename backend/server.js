import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config.js'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

// app config
const app = express()
const port = 4000

//middleware
app.use(express.json())
const allowedOrigins = [process.env.FRONTEND_URL || "https://food-del-frontend-bqm2.vercel.app/", "http://localhost:5173", "http://localhost:5174"];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}))
//db conn
connectDB();

// api end point

app.use("/api/food", foodRouter)
app.use("/images", express.static("uploads"))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.get("/", (req, res) => {
    res.status(200).send("Api working...")
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})


