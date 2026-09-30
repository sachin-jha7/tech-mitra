import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/user.js";
import { sendMail } from "../service/mail-sender.js";
import { returnHtml } from "../template/otp-template.js";
import { deleteOTP, saveOTP, verifyOTP } from "../service/otp-service.js";

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}

const generateOtp = () => {
    let otp = 0;
    for (let i = 0; i < 6; i++) {
        otp = otp * 10 + Math.floor(Math.random() * 10);
    }
    return otp;
}

const signup = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        name = name.trim();
        email = email.trim().toLowerCase();
        password = password.trim();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json("Invalid email format.");
        }
        if (!email || !name || !password) {
            return res.status(400).json("Wrong email or password");
        }
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(409).json("User already exists");
        }
        const otp = generateOtp();
        const html = returnHtml(otp);
        sendMail(email, "OTP Verification", html);
        saveOTP(email, otp);
        return res.status(200).json({ message: "An otp has been sent to your email", userInfo: { name, email, password } });

        // const redis_upstash_URL = "redis://default:2fGH[#f69K]LM@otp-service.upstash.io:6379"


    } catch (error) {
        console.log("Something went wrong", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

const verify_otp = async (req, res) => {
    try {
        // const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        let { name, email, password, otp } = req.body;
        const verificationStatus = await verifyOTP(email, otp);
        // console.log(verificationStatus.message)
        if (verificationStatus.message == "Invalid OTP") {
            return res.status(400).json("Invalid OTP");
        }
        if (verificationStatus.message == "Expired or not found") {
            return res.status(400).json("Invalid OTP");
        }
        const adminEmailList = ["sachin@async.com", "sachin@techMitra.com", "techmitra50@gmail.com"];
        let role = "user";
        if (adminEmailList.includes(email)) {
            role = "admin";
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ name, email, password: hashedPassword, role });
        const token = generateToken(newUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            partitioned: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        if (role === "admin") {
            res.status(200).json({ message: "Admin Registered Successfully", name, role });
        } else {
            res.status(200).json({ message: "User Registered Successfully", name, role });
        }
    } catch (error) {
        console.log("Something went wrong", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

const resend_otp = (req, res) => {
    const otp = generateOtp();
    let { email } = req.body;
    deleteOTP(email);
    const html = returnHtml(otp);
    sendMail(email, "OTP Verification", html);
    saveOTP(email, otp);
    return res.status(200).json("An otp has been sent to your email");
}

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        // const adminEmailList = ["sachin@async.com", "sachin@techMitra.com"];
        email = email.trim().toLowerCase();
        password = password.trim();
        // console.log(process.env.NODE_ENV === "production")
        if (!email || !password) {
            return res.status(400).json("Wrong email or password");
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json("Invalid email format.");
        }
        const userExists = await userModel.findOne({ email });
        if (!userExists) {
            return res.status(400).json("Wrong email or password");
        }
        const matchedUser = await bcrypt.compare(password, userExists.password);
        if (!matchedUser) {
            return res.status(400).json("Wrong email or password");
        }
        const userName = userExists.name;
        const token = generateToken(userExists._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            partitioned: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        const role = userExists.role;
        if (role === "admin") {
            res.status(200).json({ message: "Admin Logged-In Successfully", userName, role });
        } else {
            res.status(200).json({ message: "User Logged-In Successfully", userName, role });
        }

    } catch (error) {
        console.log("Something went wrong", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        partitioned: process.env.NODE_ENV === "production",
        path: "/"
    }).json("You have successfully logged out.");
}

export default { login, logout, signup, verify_otp, resend_otp };