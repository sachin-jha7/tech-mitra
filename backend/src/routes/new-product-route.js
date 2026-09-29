import express from "express";
const router = express.Router();
import { upload } from "../config/cloud-config.js";
import { verifyAdmin } from "../middleware/auth-middleware.js";
import newProductController from "../controllers/new-product-controller.js";


router.post("/", verifyAdmin, upload.single("image"), newProductController.createNewProduct);

export default router;