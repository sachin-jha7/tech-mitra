import express from "express";
const router = express.Router();

import { fetchProducts } from "../controllers/index-controller.js";


router.get("/", fetchProducts);

export default router;