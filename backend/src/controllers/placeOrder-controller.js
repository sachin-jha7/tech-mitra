import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
});

const createOrder = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        req.user = null;
        return res.status(401).json("Unauthorized");
    }
    try {
        const decoded = await jwt.sign(token, process.env.JWT_SECRET);
        req.user = decoded;
        // intialize the payment
        const productArray = req.body.productArray;
        const deliveryAddress = req.body.deliveryAddress;
        const userEmail = req.body.userEmail;
        let totalPrice = 0;
        for (let item of productArray) {
            totalPrice += item.price * item.qty;
        }
        // totalPrice += productArray.map((item) => item.price * item.qty);
        // console.log(totalPrice)
        const uniqueId = crypto.randomBytes(4).toString('hex');
        const options = {
            amount: totalPrice * 100, //Amount in paise 500 INR = 50,000 paise
            currency: 'INR',
            receipt: `receipt_order_${uniqueId}`
        }
        try {
            const order = await razorpay.orders.create(options);
            return res.status(200).json({ order, deliveryAddress, userEmail, totalPrice });
        } catch (error) {
            console.log("Error:", error);
            return res.status(500).json("Error occured while placing order");
        }
    } catch (error) {
        console.log("Error verifying user", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json("Unauthorized");
        }
    }
}

// const placeOrder = async (req,res) => {
//     const token = req.cookies.token;
//     if (!token) {
//         req.user = null;
//         return res.status(401).json("Unauthorized");
//     }
//     try {
//         const decoded = await jwt.sign(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         // intialize the payment
//         const productArray = req.body.productArray;
//         const deliveryAddress = req.body.deliveryAddress;
//         const userEmail = req.body.userEmail;


//     } catch (error) {
//         console.log("Error verifying user", error);
//         if (error.name === "TokenExpiredError") {
//             return res.status(401).json("Unauthorized");
//         }
//     }
// }

const verifyPayment = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        req.user = null;
        return res.status(401).json("Unauthorized");
    }
    try {
        const decoded = await jwt.sign(token, process.env.JWT_SECRET);
        req.user = decoded;
        // intialize the payment
        const productArray = req.body.productArray;
        const deliveryAddress = req.body.deliveryAddress;
        const userEmail = req.body.userEmail;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log(req.body)
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        // compare signatures
        if (generated_signature === razorpay_signature) {
            res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }

    } catch (error) {
        console.log("Error verifying user", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json("Unauthorized");
        }
    }
}

export default { createOrder, verifyPayment };