
import productModel from "../models/product.js";
import { uploadImage } from "../service/img-upload-service.js";

const createNewProduct = async (req, res) => {
    let { name, brand, category, price, stock, specifications } = req.body;
    price = parseInt(price);
    stock = parseInt(stock);
    specifications = JSON.parse(specifications)

    if (!req.file) {
        return res.status(500).json(`No file`);
    }
    try {
        const result = await uploadImage(req.file);
        // console.log(result)
        const newProduct = await new productModel({
            name,
            brand,
            category,
            price,
            stock,
            url: result.secure_url,
            specifications
        });
        await newProduct.save();
        res.status(200).json('Upload successfull');
    } catch (error) {
        return res.status(500).json("Can't upload new product, try again later!");
    }

}

export default { createNewProduct };