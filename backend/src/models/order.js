import mongoose from "mongoose";
import { Schema } from "mongoose";

const orderSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    productImgUrl: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    orderedBy: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        default: "Done"
    },
    address: {
        type: String,
        required: true
    },
    orderState: {
        type: String,
        default: "Pending" 
    }
});

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;