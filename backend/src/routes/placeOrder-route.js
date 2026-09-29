import express from "express";
const router = express.Router();
import placeOrderController from "../controllers/placeOrder-controller.js";

router.post("/create-order", placeOrderController.createOrder);
// router.post("/place-order", placeOrderController.placeOrder);
router.post("/verify-payment", placeOrderController.verifyPayment);

export default router;