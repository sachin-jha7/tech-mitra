import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
import {product} from "../data.js";
import productModel from "./models/product.js";

import indexRoute from "./routes/index-route.js";
import authRoutes from "./routes/auth-routes.js";
import placeOrderRoute from "./routes/placeOrder-route.js";
import newProductRoute from "./routes/new-product-route.js";

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/", indexRoute);
app.use("/api/auth", authRoutes);
app.use("/api/order", placeOrderRoute);
app.use("/api/product/upload", newProductRoute);


// console.log(product)

// app.get("/data", async(req,res) => {
//     for(let item of product) {
//         await productModel.create(item);
//     }
//     res.send("Uploaded");
// })



export default app;