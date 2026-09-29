import jwt from "jsonwebtoken";
import productModel from "../models/product.js";
import userModel from "../models/user.js";

export const fetchProducts = async (req, res) => {
    try {
        const token = req.cookies.token;
        let userInfo = null;
        let userEmail = null;
        let userRole = "user";
        let totalUsers = 0;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
                const allUsers = await userModel.find();
                for(let i = 0; i < allUsers.length; i++) {
                    if(allUsers[i].role == "user") {
                        totalUsers += 1;
                    }
                }
                const user = allUsers.find((user) => user._id == decoded.id);
                userInfo = user.name;
                userRole = user.role;
                userEmail = user.email;
            } catch (jwtError) {
                console.log("Token invalid or expired, proceeding as guest:", jwtError.name);
                req.user = null;
            }
        } else {
            req.user = null;
        }
        const allProducts = await productModel.find();
        res.status(200).json({ allProducts, userInfo, userRole, totalUsers, userEmail });
    } catch (dbError) {
        console.error("Database error fetching products:", dbError);
        return res.status(500).json({ message: "Internal server error fetching product directory" });
    }
}