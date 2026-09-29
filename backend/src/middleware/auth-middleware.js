import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

export const verifyAdmin = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.user = null;
        return res.status(401).json("Unauthorized");
    }
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // console.log(decoded)
        const adminUser = await userModel.findById(decoded.id);
        if(adminUser.role === "user") {
            return res.status(403).json("Access denied.");
        }
        next();
    } catch (error) {
        console.log("Error verifying user", error.name);
        if(error.name === "TokenExpiredError") {
            return res.status(401).json("Unauthorized");
        }
    }
}