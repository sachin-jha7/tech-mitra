import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: String,
    specifications: {
        type: Map,
        of: String
    },
    stock: {
        type: Number,
        required: true
    }
});

const productModel = mongoose.model("productModel", productSchema);

export default productModel;